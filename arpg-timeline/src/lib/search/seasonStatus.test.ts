import { describe, expect, it } from "vitest";

import { Game, Season } from "@/lib/cms/games.types";

import { getSeasonStatusText } from "./seasonStatus";

const NOW = Date.parse("2026-10-10T12:00:00.000Z");
const at = (offsetMs: number) => new Date(NOW + offsetMs).toISOString();
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

const season = (start: Season["start"], end?: Season["end"]): Season => ({
    _id: "s",
    _updatedAt: "",
    name: "Season",
    start,
    end,
});

const game = (overrides: Partial<Game> = {}): Game => ({
    _id: "g",
    _updatedAt: "",
    _createdAt: "",
    name: "Game",
    shortName: null,
    isDormant: false,
    isComingSoon: false,
    slug: "game",
    seasonKeyword: "season",
    url: null,
    group: null,
    logo: {} as Game["logo"],
    isOfficial: true,
    ...overrides,
});

const text = (overrides: Partial<Game>) => getSeasonStatusText(game(overrides), NOW);

describe("getSeasonStatusText", () => {
    it("counts down to a confirmed next season", () => {
        expect(
            text({ nextSeason: season({ startDate: at(3 * DAY + HOUR), confirmed: true }) }),
        ).toBe("Next season starts in 3 days");
        expect(text({ nextSeason: season({ startDate: at(5 * HOUR), confirmed: true }) })).toBe(
            "Next season starts in 5 hours",
        );
        expect(
            text({
                seasonKeyword: "league",
                nextSeason: season({ startDate: at(DAY), confirmed: true }),
            }),
        ).toBe("Next league starts in 1 day");
    });

    it("describes the current season", () => {
        expect(
            text({
                currentSeason: season(
                    { startDate: at(-30 * DAY) },
                    { endDate: at(12 * DAY), confirmed: true },
                ),
            }),
        ).toBe("Season ends in 12 days");
        expect(
            text({
                currentSeason: season(
                    { startDate: at(-30 * DAY) },
                    { endDate: at(12 * DAY), confirmed: false },
                ),
            }),
        ).toBe("Season in progress");
        expect(text({ currentSeason: season({ startDate: at(-3 * HOUR) }) })).toBe(
            "Season started 3 hours ago",
        );
    });

    it("ignores unconfirmed next starts", () => {
        expect(text({ nextSeason: season({ startDate: at(3 * DAY), confirmed: false }) })).toBe(
            "Next season not announced",
        );
    });

    it("covers dormant, coming soon and no seasons", () => {
        expect(
            text({
                isDormant: true,
                nextSeason: season({ startDate: at(DAY), confirmed: true }),
            }),
        ).toBe("No recent updates");
        expect(text({ isComingSoon: true })).toBe("Coming soon");
        expect(text({})).toBe("No seasons");
    });
});
