import { describe, expect, it } from "vitest";

import { SEARCH_GAMES } from "./__fixtures__/searchGames";
import {
    getItemHref,
    GROUP_LIMITS,
    isItemExternal,
    prepareSearch,
    runSearch,
    SearchGroup,
} from "./searchEntries";
import { QUICK_LINK_IDS, STATIC_ENTRIES } from "./staticEntries";
import { SearchGame } from "./types";

const games: SearchGame[] = SEARCH_GAMES.map((game) => ({
    ...game,
    logoSrc: null,
    categories: [],
    isDormant: false,
    isComingSoon: false,
}));

const prepared = prepareSearch(games);

const summary = (groups: SearchGroup[]) =>
    groups.map((group) => [group.id, group.results.map((r) => getItemHref(r.item))]);

describe("runSearch", () => {
    const entryIds = (group: SearchGroup | undefined) =>
        group?.results.map((r) => r.item.kind === "entry" && r.item.entry.id) ?? [];

    it("shows only quick links for an empty query", () => {
        const groups = runSearch(prepared, "  ");

        expect(groups.map((g) => g.id)).toEqual(["quick-links"]);
        expect(entryIds(groups[0])).toEqual(QUICK_LINK_IDS.filter((id) => id !== "open-filters"));
    });

    it("offers game filters only where filters can open", () => {
        const actions = (canOpenFilters: boolean) =>
            entryIds(
                runSearch(prepared, "filters", { canOpenFilters }).find((g) => g.id === "actions"),
            );

        expect(actions(false)).toEqual([]);
        expect(actions(true)).toEqual(["open-filters"]);
        expect(entryIds(runSearch(prepared, "", { canOpenFilters: true })[0])).toContain(
            "open-filters",
        );
    });

    it("orders groups games, pages, actions and drops empty ones", () => {
        expect(summary(runSearch(prepared, "news"))).toEqual([
            ["pages", ["/news"]],
            ["actions", ["/games/news"]],
        ]);
        expect(runSearch(prepared, "grim dawn").map((g) => g.id)).toEqual(["games"]);
    });

    it("caps each group", () => {
        const groups = runSearch(prepared, "d");
        const gamesGroup = groups.find((g) => g.id === "games")!;

        expect(gamesGroup.results).toHaveLength(GROUP_LIMITS.games);
        groups.forEach((group) =>
            expect(group.results.length).toBeLessThanOrEqual(
                GROUP_LIMITS[group.id as keyof typeof GROUP_LIMITS],
            ),
        );
    });

    it.each([
        ["patreon", "/support"],
        ["gdpr", "/privacy"],
        ["privacy policy", "/privacy"],
        ["toc", "/terms"],
        ["credits", "/support#supporters"],
        ["launcher", "/community-launchers"],
        ["license", "/transparency"],
    ])("%s finds %s first", (query, href) => {
        const pages = runSearch(prepared, query).find((g) => g.id === "pages")!;

        expect(getItemHref(pages.results[0]!.item)).toBe(href);
    });

    it("finds the Discord server as an external action", () => {
        const actions = runSearch(prepared, "discord").find((g) => g.id === "actions")!;
        const [first] = actions.results;

        expect(first!.item.kind === "entry" && first!.item.entry.id).toBe("join-discord");
        expect(isItemExternal(first!.item)).toBe(true);
    });

    it("still searches pages and actions before games load", () => {
        expect(summary(runSearch(prepareSearch(null), "catalog"))).toEqual([
            ["actions", ["/dashboard/all"]],
        ]);
    });
});

describe("STATIC_ENTRIES", () => {
    it("has unique ids and every quick link exists", () => {
        const ids = STATIC_ENTRIES.map((entry) => entry.id);

        expect(new Set(ids).size).toBe(ids.length);
        expect(QUICK_LINK_IDS.filter((id) => !ids.includes(id))).toEqual([]);
    });
});
