import { describe, expect, it } from "vitest";

import { Game } from "@/lib/cms/games.types";

import {
    buildGamePageDescription,
    buildGamePageOgDescription,
    buildGamePageOgTitle,
    buildGamePageTitle,
    formatUtcDateTime,
} from "./metadata";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FUTURE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
const PAST = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

function makeGame(overrides: Partial<Game> = {}): Game {
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
        nextSeason: undefined,
        ...overrides,
    };
}

// ─── formatUtcDateTime ────────────────────────────────────────────────────────

describe("formatUtcDateTime", () => {
    it("formats date with time when timeUnknown is false", () => {
        expect(formatUtcDateTime("2026-04-04T12:00:00.000Z", false)).toBe(
            "Apr 4, 2026 12:00 UTC",
        );
    });

    it("formats date with time when timeUnknown is undefined", () => {
        expect(formatUtcDateTime("2026-04-04T12:00:00.000Z", undefined)).toBe(
            "Apr 4, 2026 12:00 UTC",
        );
    });

    it("formats date with time when timeUnknown is null", () => {
        expect(formatUtcDateTime("2026-04-04T12:00:00.000Z", null)).toBe(
            "Apr 4, 2026 12:00 UTC",
        );
    });

    it("omits time when timeUnknown is true", () => {
        expect(formatUtcDateTime("2026-04-04T00:00:00.000Z", true)).toBe("Apr 4, 2026");
    });

    it("pads hours and minutes with leading zeros", () => {
        expect(formatUtcDateTime("2026-01-01T09:05:00.000Z", false)).toBe(
            "Jan 1, 2026 09:05 UTC",
        );
    });

    it("handles midnight UTC correctly", () => {
        expect(formatUtcDateTime("2026-12-25T00:00:00.000Z", false)).toBe(
            "Dec 25, 2026 00:00 UTC",
        );
    });

    it("handles single-digit day without padding", () => {
        expect(formatUtcDateTime("2026-03-07T18:30:00.000Z", false)).toBe(
            "Mar 7, 2026 18:30 UTC",
        );
    });
});

// ─── buildGamePageTitle ───────────────────────────────────────────────────────

describe("buildGamePageTitle", () => {
    it("includes season name and UTC datetime when next season is confirmed with known time", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: "2027-04-04T12:00:00.000Z", confirmed: true, timeUnknown: false },
            },
        });
        expect(buildGamePageTitle(game)).toBe(
            "Test Game – Season 2 starts Apr 4, 2027 12:00 UTC | aRPG Timeline",
        );
    });

    it("falls back when next season confirmed but time is unknown", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: FUTURE, confirmed: true, timeUnknown: true },
            },
        });
        expect(buildGamePageTitle(game)).toBe("Test Game Updates | aRPG Timeline");
    });

    it("falls back when next season not confirmed", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: FUTURE, confirmed: false, timeUnknown: false },
            },
        });
        expect(buildGamePageTitle(game)).toBe("Test Game Updates | aRPG Timeline");
    });

    it("falls back when next season start date is in the past", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: PAST, confirmed: true, timeUnknown: false },
            },
        });
        expect(buildGamePageTitle(game)).toBe("Test Game Updates | aRPG Timeline");
    });

    it("falls back when next season has no start date", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { confirmed: true, timeUnknown: false },
            },
        });
        expect(buildGamePageTitle(game)).toBe("Test Game Updates | aRPG Timeline");
    });

    it("falls back when there is no next season", () => {
        const game = makeGame({ nextSeason: undefined });
        expect(buildGamePageTitle(game)).toBe("Test Game Updates | aRPG Timeline");
    });
});

// ─── buildGamePageDescription ─────────────────────────────────────────────────

describe("buildGamePageDescription", () => {
    it("includes next season name and datetime when confirmed with known time", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: "2027-04-04T12:00:00.000Z", confirmed: true, timeUnknown: false },
            },
        });
        expect(buildGamePageDescription(game)).toContain(
            "Next season: Season 2 (starts Apr 4, 2027 12:00 UTC)",
        );
    });

    it("includes next season name with date-only when confirmed but time is unknown", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: "2026-06-01T00:00:00.000Z", confirmed: true, timeUnknown: true },
            },
        });
        const desc = buildGamePageDescription(game);
        expect(desc).toContain("Season 2 (starts Jun 1, 2026)");
        expect(desc).not.toContain("UTC");
    });

    it("falls back to current season when next season is not confirmed", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: FUTURE, confirmed: false },
            },
            currentSeason: {
                _id: "s0",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 1",
                start: {
                    startDate: "2026-01-10T10:00:00.000Z",
                    confirmed: true,
                    timeUnknown: false,
                },
            },
        });
        expect(buildGamePageDescription(game)).toContain(
            "Current season: Season 1 (started Jan 10, 2026 10:00 UTC)",
        );
    });

    it("falls back to current season with date-only when current season time is unknown", () => {
        const game = makeGame({
            currentSeason: {
                _id: "s0",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 1",
                start: {
                    startDate: "2026-01-10T00:00:00.000Z",
                    confirmed: true,
                    timeUnknown: true,
                },
            },
        });
        const desc = buildGamePageDescription(game);
        expect(desc).toContain("Season 1 (started Jan 10, 2026)");
        expect(desc).not.toContain("UTC");
    });

    it("returns base description when no confirmed seasons", () => {
        const game = makeGame();
        expect(buildGamePageDescription(game)).toBe(
            "Track Test Game seasons and updates. Get countdowns, start dates, and never miss a Test Game season launch.",
        );
    });

    it("does not include past next season in description", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: PAST, confirmed: true, timeUnknown: false },
            },
        });
        expect(buildGamePageDescription(game)).not.toContain("Next season");
    });

    it("uses the game seasonKeyword in descriptions", () => {
        const game = makeGame({ seasonKeyword: "league" });
        expect(buildGamePageDescription(game)).toContain("leagues");
        expect(buildGamePageDescription(game)).toContain("league launch");
    });
});

// ─── buildGamePageOgTitle ─────────────────────────────────────────────────────

describe("buildGamePageOgTitle", () => {
    it("includes date when next season confirmed with known time", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: "2027-04-04T12:00:00.000Z", confirmed: true, timeUnknown: false },
            },
        });
        expect(buildGamePageOgTitle(game)).toBe(
            "Test Game – Season 2 starts Apr 4, 2027 12:00 UTC",
        );
    });

    it("falls back to generic tracker title otherwise", () => {
        expect(buildGamePageOgTitle(makeGame())).toBe("Test Game Season Tracker");
    });

    it("falls back when time is unknown", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: FUTURE, confirmed: true, timeUnknown: true },
            },
        });
        expect(buildGamePageOgTitle(game)).toBe("Test Game Season Tracker");
    });
});

// ─── buildGamePageOgDescription ──────────────────────────────────────────────

describe("buildGamePageOgDescription", () => {
    it("mentions next season when confirmed and in the future", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: FUTURE, confirmed: true },
            },
        });
        expect(buildGamePageOgDescription(game)).toBe(
            "Track Test Game seasons and get countdowns for upcoming content. Next season: Season 2.",
        );
    });

    it("mentions current season when no confirmed next season", () => {
        const game = makeGame({
            currentSeason: {
                _id: "s0",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 1",
            },
        });
        expect(buildGamePageOgDescription(game)).toBe(
            "Track Test Game seasons and get countdowns for upcoming content. Current season: Season 1.",
        );
    });

    it("returns generic description when no seasons present", () => {
        expect(buildGamePageOgDescription(makeGame())).toBe(
            "Track Test Game seasons and get countdowns for upcoming content.",
        );
    });

    it("does not mention past next season", () => {
        const game = makeGame({
            nextSeason: {
                _id: "s1",
                _updatedAt: "2026-01-01T00:00:00Z",
                name: "Season 2",
                start: { startDate: PAST, confirmed: true },
            },
        });
        expect(buildGamePageOgDescription(game)).not.toContain("Next season");
    });
});
