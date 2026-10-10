import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
    confirmedEnd,
    confirmedNextStart,
    editorOverride,
    endTooSoon,
    farFutureRelease,
    missingEndDates,
    pastConfirmedEnd,
    singleUpcoming,
    startedLatest,
    unconfirmedNextStart,
} from "./__fixtures__/sanityGames";
import { getAverageSeasonDuration, parseGamesFromSanity } from "./parseGamesFromSanity";
import { SanityGame, SanitySeason } from "./queries/indexQuery";

// Fixtures were captured at this moment
const NOW = "2026-10-10T12:00:00.000Z";
const DAY_MS = 24 * 60 * 60 * 1000;
// DEFAULT_SEASON_OFFSET is 120 * 24 * 50 * 60 * 1000, i.e. 100 days
const DEFAULT_OFFSET_DAYS = 100;

const withAverage = (game: SanityGame, days: number) => ({
    ...game,
    averageSeasonDuration: days * DAY_MS,
});

const parseOne = (game: SanityGame) => parseGamesFromSanity({ games: [game] })[0]!;

const plusDays = (iso: string, days: number) =>
    new Date(Date.parse(iso) + days * DAY_MS).toISOString();

describe("parseGamesFromSanity", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(NOW));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("game fields", () => {
        it("maps fields and fills defaults for missing values", () => {
            const game = parseOne(missingEndDates());

            expect(game).toMatchObject({
                _id: "game-missing-end-dates",
                name: "Missing End Dates",
                slug: "missing-end-dates",
                shortName: "MED",
                seasonKeyword: "season",
                url: "https://example.com/missing-end-dates",
                buildsUrl: "",
                guidesUrl: "",
                group: "Group C",
                categories: ["community", "seasonal"],
                tags: [],
                isDormant: false,
                isComingSoon: false,
                isOfficial: false,
                twitchCategory: null,
                averageSeasonDuration: undefined,
            });
        });

        it("maps null strings to empty strings", () => {
            const game = parseOne({ ...confirmedEnd(), url: undefined });

            expect(game.shortName).toBe("");
            expect(game.group).toBe("");
            expect(game.url).toBe("");
        });

        it("is official unless in the community category", () => {
            expect(parseOne(startedLatest()).isOfficial).toBe(true);
            expect(parseOne(unconfirmedNextStart()).isOfficial).toBe(false);
        });

        it("takes the twitch category from the twitch channel", () => {
            expect(parseOne(startedLatest()).twitchCategory).toBe("started-latest");
            expect(parseOne(singleUpcoming()).twitchCategory).toBeNull();
        });

        it("defaults missing keyword, categories and tags", () => {
            const input = startedLatest();
            delete input.seasonKeyword;
            delete input.categories;
            delete input.tags;
            const game = parseOne(input);

            expect(game).toMatchObject({ seasonKeyword: "", categories: [], tags: [] });
            // Synthesized name reads the raw keyword
            expect(game.nextSeason?.name).toBe("Next undefined");
        });

        it("keeps dormant and coming soon flags", () => {
            expect(parseOne(endTooSoon()).isDormant).toBe(true);
            expect(parseOne(farFutureRelease()).isComingSoon).toBe(true);
        });
    });

    describe("average season duration", () => {
        it.each([
            [10, 7, "Avg. 7 days"],
            [45, 42, "Avg. 6 weeks"],
            [120, 120, "Avg. 4 months"],
            [120.2, 120, "Avg. 4 months"],
            [182, 182, "Avg. 6 months"],
            [400, 399, "Avg. 1 years"],
        ])("%d days rounds to %d and shows %s", (days, rounded, text) => {
            const game = parseOne(withAverage(startedLatest(), days));

            expect(game.averageSeasonDuration).toBe(rounded);
            expect(game.currentSeason?.end?.overrideText).toBe(text);
        });

        it("has no average and no avg. text without season history", () => {
            const game = parseOne(startedLatest());

            expect(game.averageSeasonDuration).toBeUndefined();
            expect(game.currentSeason?.end?.overrideText).toBeNull();
        });
    });

    describe("latest season not started yet", () => {
        it("uses the confirmed next start as the current end, without avg. text", () => {
            const game = parseOne(withAverage(confirmedNextStart(), 120));

            expect(game.currentSeason?.name).toBe("Season 1");
            expect(game.currentSeason?.end).toEqual({
                additionalText: "",
                confirmed: false,
                endDate: "2026-10-16T02:00:00.000Z",
                overrideText: null,
            });
            expect(game.nextSeason?.name).toBe("Season 2");
            expect(game.nextSeason?.start).toMatchObject({
                confirmed: true,
                startDate: "2026-10-16T02:00:00.000Z",
            });
            expect(game.nextSeason?.end?.endDate).toBe("2027-02-09T07:00:00.000Z");
        });

        it("uses the unconfirmed next start as the current end, with avg. text", () => {
            const game = parseOne(withAverage(unconfirmedNextStart(), 182));

            expect(game.currentSeason?.name).toBe("Season 1");
            expect(game.currentSeason?.end).toMatchObject({
                confirmed: false,
                endDate: "2026-10-31T16:00:00.000Z",
                overrideText: "Avg. 6 months",
            });
            expect(game.nextSeason?.start).toMatchObject({
                confirmed: false,
                startDate: "2026-10-31T16:00:00.000Z",
            });
        });

        it("pushes an unconfirmed next start back by 10% of the offset when it is too close", () => {
            vi.setSystemTime(new Date("2026-10-25T00:00:00.000Z"));
            const game = parseOne(withAverage(unconfirmedNextStart(), 182));
            const pushed = plusDays("2026-10-31T16:00:00.000Z", 18.2);

            expect(game.nextSeason?.start?.startDate).toBe(pushed);
            expect(game.currentSeason?.end?.endDate).toBe(pushed);
        });

        it("keeps a confirmed current end even if the next season starts later", () => {
            const game = parseOne(confirmedEnd());

            expect(game.currentSeason?.end).toMatchObject({
                confirmed: true,
                endDate: "2026-10-16T20:00:00.000Z",
            });
            expect(game.nextSeason?.start?.startDate).toBe("2026-10-17T00:00:00.000Z");
        });

        it("keeps a past confirmed current end", () => {
            const game = parseOne(pastConfirmedEnd());

            expect(game.currentSeason?.end).toMatchObject({
                confirmed: true,
                endDate: "2025-01-19T15:00:00.000Z",
            });
        });

        it("keeps an editor override on the current end instead of avg. text", () => {
            const game = parseOne(withAverage(editorOverride(), 120));

            expect(game.currentSeason?.end).toMatchObject({
                confirmed: false,
                endDate: "2027-03-22T18:00:00.000Z",
                overrideText: "Next update in December",
            });
            expect(game.nextSeason?.start?.overrideText).toBe("March 2027");
        });

        it("simulates a missing next end from the next start", () => {
            const game = parseOne(pastConfirmedEnd());

            expect(game.nextSeason?.end).toMatchObject({
                confirmed: false,
                endDate: plusDays("2026-11-01T00:00:00.000Z", DEFAULT_OFFSET_DAYS),
            });
        });
    });

    describe("only one season and it has not started", () => {
        it("has no current season and keeps the next one as is", () => {
            const game = parseOne(singleUpcoming());

            expect(game.currentSeason).toBeUndefined();
            expect(game.nextSeason).toMatchObject({
                name: "Season 1",
                start: { confirmed: true, startDate: "2026-10-19T17:00:00.000Z" },
                end: { confirmed: true, endDate: "2026-10-26T17:00:00.000Z" },
            });
        });

        it("creates the next end object when it is missing entirely", () => {
            const input = farFutureRelease();
            delete input.recentSeasons[0]!.end;
            const game = parseOne(input);

            expect(game.nextSeason?.end).toEqual({
                confirmed: false,
                endDate: "2029-08-22T00:00:00.000Z",
            });
        });

        it("simulates a missing end from a far future start", () => {
            const game = parseOne(farFutureRelease());

            expect(game.currentSeason).toBeUndefined();
            expect(game.nextSeason?.start).toMatchObject({
                confirmed: false,
                startDate: "2029-05-14T00:00:00.000Z",
                overrideText: "Spring 2029",
            });
            expect(game.nextSeason?.end?.endDate).toBe("2029-08-22T00:00:00.000Z");
        });
    });

    describe("latest season already started", () => {
        it("synthesizes an unconfirmed next season starting at the current end", () => {
            const game = parseOne(withAverage(startedLatest(), 120));

            expect(game.currentSeason?.name).toBe("Season 2");
            expect(game.currentSeason?.end).toMatchObject({
                confirmed: false,
                endDate: "2026-11-19T21:00:00.000Z",
                overrideText: "Avg. 4 months",
            });
            expect(game.nextSeason).toEqual({
                _id: "season-started-latest-2",
                _updatedAt: "2026-07-16T23:00:36Z",
                name: "Next league",
                start: {
                    confirmed: false,
                    startDate: "2026-11-19T21:00:00.000Z",
                    overrideText: "To be announced",
                },
                end: { confirmed: false, endDate: "2026-11-19T21:00:00.000Z" },
            });
        });

        it("copies a current end override to the synthesized next start", () => {
            const input = startedLatest();
            input.recentSeasons[0]!.end!.overrideText = "December";
            const game = parseOne(input);

            expect(game.nextSeason?.start?.overrideText).toBe("December");
        });

        it("pushes a too close unconfirmed current end back by 10% of the default offset", () => {
            const game = parseOne(endTooSoon());
            const pushed = plusDays("2026-10-18T22:30:00.000Z", DEFAULT_OFFSET_DAYS * 0.1);

            expect(game.currentSeason?.name).toBe("Season 2");
            expect(game.currentSeason?.end).toMatchObject({
                confirmed: false,
                endDate: pushed,
                overrideText: "",
            });
            expect(game.nextSeason?.start).toMatchObject({
                startDate: pushed,
                overrideText: "To be announced",
            });
            // The synthesized next end is not pushed
            expect(game.nextSeason?.end?.endDate).toBe("2026-10-18T22:30:00.000Z");
        });

        it("simulates a missing current end as start + 110% of the default offset", () => {
            const game = parseOne(missingEndDates());

            expect(game.currentSeason?.end).toEqual({
                additionalText: "",
                confirmed: false,
                endDate: "2026-12-23T18:00:00.000Z",
                overrideText: "",
            });
            expect(game.nextSeason?.start?.startDate).toBe("2026-12-23T18:00:00.000Z");
            expect(game.nextSeason?.end?.endDate).toBe("2026-12-23T18:00:00.000Z");
        });

        it("simulates a missing current end as start + 110% of the average", () => {
            const game = parseOne(withAverage(missingEndDates(), 120));

            expect(game.currentSeason?.end).toMatchObject({
                endDate: plusDays("2026-09-04T18:00:00.000Z", 132),
                overrideText: "Avg. 4 months",
            });
        });

        it("creates the current end object when it is missing entirely", () => {
            const input = missingEndDates();
            delete input.recentSeasons[0]!.end;
            const game = parseOne(input);

            expect(game.currentSeason?.end).toEqual({ endDate: "2026-12-23T18:00:00.000Z" });
        });
    });

    describe("seasons input", () => {
        it("picks seasons by start date regardless of input order", () => {
            const input = confirmedNextStart();
            input.recentSeasons.reverse();
            const game = parseOne(input);

            expect(game.currentSeason?.name).toBe("Season 1");
            expect(game.nextSeason?.name).toBe("Season 2");
        });

        it("has no seasons when there are none", () => {
            const game = parseOne({ ...singleUpcoming(), recentSeasons: [] });

            expect(game.currentSeason).toBeUndefined();
            expect(game.nextSeason).toBeUndefined();
        });

        it("mutates the input seasons", () => {
            const input = withAverage(startedLatest(), 120);
            parseOne(input);

            expect(input.recentSeasons[0]!.end!.overrideText).toBe("Avg. 4 months");
        });
    });

    describe("seasons with missing dates", () => {
        const latestWithoutStart = () => {
            const input = confirmedNextStart();
            delete input.recentSeasons[0]!.start;
            return input;
        };

        it("treats a latest season without start date as next when listed first", () => {
            const game = parseOne(latestWithoutStart());

            expect(game.currentSeason?.name).toBe("Season 1");
            expect(game.currentSeason?.end?.endDate).toBe("2026-10-23T07:00:00.000Z");
            expect(game.nextSeason?.name).toBe("Season 2");
            expect(game.nextSeason?.start?.startDate).toBeUndefined();
            expect(game.nextSeason?.end?.endDate).toBe("2027-02-09T07:00:00.000Z");
        });

        it("drops a latest season without start date when listed last", () => {
            const input = latestWithoutStart();
            input.recentSeasons.reverse();
            const game = parseOne(input);

            expect(game.currentSeason?.name).toBe("Season 1");
            expect(game.nextSeason).toMatchObject({
                name: "Next season",
                start: { startDate: "2026-10-23T07:00:00.000Z" },
                end: { endDate: "2026-10-23T07:00:00.000Z" },
            });
        });

        it("simulates a next end from the current end when the next season has no dates", () => {
            const input = latestWithoutStart();
            input.recentSeasons[0]!.end!.endDate = undefined;
            const game = parseOne(input);

            expect(game.nextSeason?.end?.endDate).toBe(
                plusDays("2026-10-23T07:00:00.000Z", DEFAULT_OFFSET_DAYS),
            );
        });

        it("throws when the next season has no start date and no end", () => {
            const input = latestWithoutStart();
            delete input.recentSeasons[0]!.end;

            expect(() => parseOne(input)).toThrow(RangeError);
        });

        it("keeps a current season without start date", () => {
            const input = confirmedNextStart();
            delete input.recentSeasons[1]!.start;
            const game = parseOne(input);

            expect(game.currentSeason?.name).toBe("Season 1");
            expect(game.currentSeason?.end?.endDate).toBe("2026-10-16T02:00:00.000Z");
        });

        it("throws when the current season has no start date and no end", () => {
            const input = confirmedNextStart();
            delete input.recentSeasons[1]!.start;
            delete input.recentSeasons[1]!.end;

            expect(() => parseOne(input)).toThrow(RangeError);
        });
    });

    describe("grace period", () => {
        it("marks a season started under 2 hours ago as just started", () => {
            vi.setSystemTime(new Date("2026-10-16T03:00:00.000Z"));
            const game = parseOne(confirmedNextStart());

            expect(game.currentSeason?.name).toBe("Season 2");
            expect(game.currentSeason?.start).toMatchObject({
                justStarted: true,
                overrideText: "Just started",
            });
        });

        it("shows hours since start within 72 hours", () => {
            vi.setSystemTime(new Date("2026-10-18T07:00:00.000Z"));
            const game = parseOne(confirmedNextStart());

            expect(game.currentSeason?.start).toMatchObject({
                justStarted: true,
                overrideText: "Started 53 hours ago",
            });
        });

        it("is not just started after 72 hours", () => {
            vi.setSystemTime(new Date("2026-10-19T03:00:00.000Z"));
            const game = parseOne(confirmedNextStart());

            expect(game.currentSeason?.start?.justStarted).toBeUndefined();
            expect(game.currentSeason?.start?.overrideText).toBeNull();
        });
    });

    describe("ordering", () => {
        it("sorts by next season start, games without seasons last", () => {
            const games = parseGamesFromSanity({
                games: [
                    { ...farFutureRelease(), recentSeasons: [] },
                    startedLatest(),
                    unconfirmedNextStart(),
                    singleUpcoming(),
                ],
            });

            expect(games.map((g) => g.slug)).toEqual([
                "single-upcoming",
                "unconfirmed-next-start",
                "started-latest",
                "far-future-release",
            ]);
        });

        it("puts games in the grace period first", () => {
            vi.setSystemTime(new Date("2026-10-16T03:00:00.000Z"));
            const games = parseGamesFromSanity({
                games: [startedLatest(), singleUpcoming(), confirmedNextStart()],
            });

            expect(games.map((g) => g.slug)).toEqual([
                "confirmed-next-start",
                "single-upcoming",
                "started-latest",
            ]);
        });

        it("puts games whose season is over last", () => {
            // Over: next start equals next end and the current end has passed
            const over = pastConfirmedEnd();
            over.recentSeasons[0]!.end!.endDate = "2026-11-01T00:00:00.000Z";
            const games = parseGamesFromSanity({
                games: [over, startedLatest(), singleUpcoming()],
            });

            expect(games.map((g) => g.slug)).toEqual([
                "single-upcoming",
                "started-latest",
                "past-confirmed-end",
            ]);
        });

        it("breaks next start ties by current end", () => {
            const earlierEnd = { ...confirmedEnd(), slug: "earlier-end" };
            earlierEnd.recentSeasons[1]!.end!.endDate = "2026-10-15T00:00:00.000Z";

            for (const games of [
                [confirmedEnd(), earlierEnd],
                [earlierEnd, confirmedEnd()],
            ]) {
                expect(parseGamesFromSanity({ games }).map((g) => g.slug)).toEqual([
                    "earlier-end",
                    "confirmed-end",
                ]);
            }
        });

        it("puts a next season without start date after dated ones", () => {
            const undated = confirmedNextStart();
            delete undated.recentSeasons[0]!.start;

            for (const games of [
                [undated, unconfirmedNextStart()],
                [unconfirmedNextStart(), undated],
            ]) {
                expect(parseGamesFromSanity({ games }).map((g) => g.slug)).toEqual([
                    "unconfirmed-next-start",
                    "confirmed-next-start",
                ]);
            }
        });

        it("keeps games without seasons in input order after games with seasons", () => {
            const empty = (slug: string) => ({ ...singleUpcoming(), slug, recentSeasons: [] });
            const games = parseGamesFromSanity({
                games: [empty("empty-1"), singleUpcoming(), empty("empty-2")],
            });

            expect(games.map((g) => g.slug)).toEqual(["single-upcoming", "empty-1", "empty-2"]);
        });
    });
});

describe("getAverageSeasonDuration", () => {
    const season = (startDate: string, endDate?: string, isSideEvent?: boolean) =>
        ({
            start: { startDate },
            end: endDate ? { endDate } : undefined,
            isSideEvent,
        }) as SanitySeason;

    it("returns undefined with fewer than 3 valid durations", () => {
        expect(
            getAverageSeasonDuration([
                season("2026-01-01T00:00:00Z", "2026-01-11T00:00:00Z"),
                season("2026-02-01T00:00:00Z", "2026-02-11T00:00:00Z"),
                season("2026-03-01T00:00:00Z"),
            ]),
        ).toBeUndefined();
    });

    it("averages main season durations, ignoring side events and invalid ranges", () => {
        expect(
            getAverageSeasonDuration([
                season("2026-01-01T00:00:00Z", "2026-01-11T00:00:00Z"),
                season("2026-02-01T00:00:00Z", "2026-02-21T00:00:00Z"),
                season("2026-03-01T00:00:00Z", "2026-03-31T00:00:00Z"),
                season("2026-04-01T00:00:00Z", "2026-06-01T00:00:00Z", true),
                season("2026-05-01T00:00:00Z", "2026-04-01T00:00:00Z"),
                season("not a date", "2026-04-01T00:00:00Z"),
            ]),
        ).toBe(20 * DAY_MS);
    });
});
