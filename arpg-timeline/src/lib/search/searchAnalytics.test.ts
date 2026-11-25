import { beforeEach, describe, expect, it, vi } from "vitest";

import { sa_event } from "@/lib/sa_event";

import { createSearchSession, getItemSelection, getSearchPageType } from "./searchAnalytics";
import { STATIC_ENTRIES } from "./staticEntries";
import { SearchGame } from "./types";

const game: SearchGame = {
    slug: "diablo-iv",
    name: "Diablo IV",
    shortName: "D4",
    group: null,
    logoSrc: null,
    categories: [],
    isDormant: false,
    isComingSoon: false,
    url: null,
};
const entry = (id: string) => STATIC_ENTRIES.find((e) => e.id === id)!;

vi.mock("@/lib/sa_event", () => ({ sa_event: vi.fn() }));

describe("getSearchPageType", () => {
    it("tells dashboards, game pages and the rest apart", () => {
        expect(getSearchPageType("/", true)).toBe("dashboard");
        expect(getSearchPageType("/game/diablo-iv/timeline", false)).toBe("game");
        expect(getSearchPageType("/faq", false)).toBe("other");
    });
});

describe("getItemSelection", () => {
    it("names games, game links and entries by id, never by query", () => {
        expect(getItemSelection({ kind: "game", game }, true)).toEqual({
            kind: "game",
            target: "diablo-iv",
        });
        expect(getItemSelection({ kind: "game-link", game, link: "calendar" }, true)).toEqual({
            kind: "game_link",
            target: "diablo-iv:calendar",
        });
        expect(getItemSelection({ kind: "entry", entry: entry("faq") }, true)).toEqual({
            kind: "page",
            target: "faq",
        });
        expect(getItemSelection({ kind: "entry", entry: entry("open-filters") }, true)).toEqual({
            kind: "action",
            target: "open-filters",
        });
    });

    it("marks entries picked from the empty state as quick links", () => {
        expect(getItemSelection({ kind: "entry", entry: entry("faq") }, false)).toEqual({
            kind: "quick_link",
            target: "faq",
        });
    });
});

describe("createSearchSession", () => {
    beforeEach(() => vi.mocked(sa_event).mockClear());

    it("reports a close with what happened, when nothing was chosen", () => {
        const session = createSearchSession();
        session.markTyped();
        session.markNoResults();
        session.close();

        expect(sa_event).toHaveBeenCalledWith("search_close", {
            typed: true,
            had_no_results: true,
        });
    });

    it("reports the selection and skips the close event", () => {
        const session = createSearchSession();
        session.select({ kind: "game", target: "diablo-iv" }, "keyboard", 1);
        session.close();

        expect(sa_event).toHaveBeenCalledTimes(1);
        expect(sa_event).toHaveBeenCalledWith("search_select", {
            kind: "game",
            target: "diablo-iv",
            input: "keyboard",
            position: 1,
        });
    });
});
