import { describe, expect, it } from "vitest";

import { Game } from "@/lib/cms/games.types";

import { buildNextSeasonHeading } from "./nextSeasonHeading";

const NOW = new Date("2026-03-01T00:00:00.000Z");

function makeGame(nextSeason?: Game["nextSeason"]): Game {
    return {
        _id: "game-1",
        _updatedAt: "2026-01-01T00:00:00Z",
        _createdAt: "2026-01-01T00:00:00Z",
        name: "Test Game",
        shortName: "TG",
        slug: "test-game",
        seasonKeyword: "season",
        url: "https://example.com",
        group: null,
        logo: {} as Game["logo"],
        isDormant: false,
        isComingSoon: false,
        isOfficial: true,
        currentSeason: undefined,
        nextSeason,
    };
}

const season = (start: NonNullable<Game["nextSeason"]>["start"]): Game["nextSeason"] => ({
    _id: "s1",
    _updatedAt: "2026-01-01T00:00:00Z",
    name: "Season 2",
    start,
});

describe("buildNextSeasonHeading", () => {
    it("returns null when there is no next season", () => {
        expect(buildNextSeasonHeading(makeGame(), NOW)).toBeNull();
    });

    it("returns null when next season has no name", () => {
        const game = makeGame({ ...season(undefined)!, name: "" });
        expect(buildNextSeasonHeading(game, NOW)).toBeNull();
    });

    it("includes UTC date and time when confirmed with known time", () => {
        const game = makeGame(
            season({ startDate: "2026-04-04T12:00:00.000Z", confirmed: true, timeUnknown: false }),
        );
        expect(buildNextSeasonHeading(game, NOW)).toBe(
            "Next season: Season 2 – starts Apr 4, 2026 12:00 UTC",
        );
    });

    it("formats in UTC regardless of how close the time is to midnight", () => {
        const game = makeGame(
            season({ startDate: "2026-04-04T23:30:00.000Z", confirmed: true, timeUnknown: false }),
        );
        expect(buildNextSeasonHeading(game, NOW)).toBe(
            "Next season: Season 2 – starts Apr 4, 2026 23:30 UTC",
        );
    });

    it("shows date only when time is unknown", () => {
        const game = makeGame(
            season({ startDate: "2026-04-04T00:00:00.000Z", confirmed: true, timeUnknown: true }),
        );
        expect(buildNextSeasonHeading(game, NOW)).toBe(
            "Next season: Season 2 – starts Apr 4, 2026",
        );
    });

    it("drops the date when start is not confirmed", () => {
        const game = makeGame(
            season({ startDate: "2026-04-04T12:00:00.000Z", confirmed: false, timeUnknown: false }),
        );
        expect(buildNextSeasonHeading(game, NOW)).toBe("Next season: Season 2");
    });

    it("drops the date when start is in the past", () => {
        const game = makeGame(
            season({ startDate: "2026-02-01T12:00:00.000Z", confirmed: true, timeUnknown: false }),
        );
        expect(buildNextSeasonHeading(game, NOW)).toBe("Next season: Season 2");
    });

    it("uses the game's season keyword", () => {
        const game = {
            ...makeGame(
                season({
                    startDate: "2026-04-04T12:00:00.000Z",
                    confirmed: true,
                    timeUnknown: false,
                }),
            ),
            seasonKeyword: "league",
        };
        expect(buildNextSeasonHeading(game, NOW)).toBe(
            "Next league: Season 2 – starts Apr 4, 2026 12:00 UTC",
        );
    });

    it("shows To be announced when next season is the current season", () => {
        const next = season({ confirmed: false });
        const game = { ...makeGame(next), currentSeason: next };
        expect(buildNextSeasonHeading(game, NOW)).toBe("Next season: To be announced");
    });

    it("drops the date when there is no start date", () => {
        const game = makeGame(season({ confirmed: true }));
        expect(buildNextSeasonHeading(game, NOW)).toBe("Next season: Season 2");
    });
});
