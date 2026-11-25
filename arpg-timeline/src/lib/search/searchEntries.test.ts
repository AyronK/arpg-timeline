import { describe, expect, it } from "vitest";

import { COMMUNITY_SLUGS, SEARCH_GAMES } from "./__fixtures__/searchGames";
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
    categories: COMMUNITY_SLUGS.has(game.slug) ? ["community"] : [],
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

    it.each([
        ["d4 patch notes", "/game/diablo-iv"],
        ["diablo 4 patch notes", "/game/diablo-iv"],
        ["d4 season 11", "/game/diablo-iv"],
        ["d4 battle pass", "/game/diablo-iv"],
        ["poe2 new league date", "/game/path-of-exile2"],
        ["poe2 release date", "/game/path-of-exile2"],
        ["path of exile 2 new league", "/game/path-of-exile2"],
        ["grim dawn patch notes", "/game/grim-dawn"],
    ])("%s drops trailing words and finds %s first", (query, href) => {
        const [first] = runSearch(prepared, query);

        expect(getItemHref(first!.results[0]!.item)).toBe(href);
    });

    it("prefers a full-query match over dropping words", () => {
        expect(summary(runSearch(prepared, "community launchers"))).toEqual([
            ["pages", ["/community-launchers"]],
        ]);
    });

    it("ranks official games above community ones on ties", () => {
        const gameHrefs = (query: string) =>
            runSearch(prepared, query)[0]!.results.map((r) => getItemHref(r.item));

        expect(gameHrefs("diablo")).toEqual([
            "/game/diablo-ii-resurrected",
            "/game/diablo-iii",
            "/game/diablo-iv",
            "/game/diablo-v",
            "/game/diablo-2-evolution",
            "/game/blizzless-d2r",
        ]);
        expect(gameHrefs("diablo 2")[0]).toBe("/game/diablo-ii-resurrected");
    });

    it("ranks games visible on the dashboard above official ones on ties", () => {
        const [games] = runSearch(prepared, "diablo", {
            isVisible: (item) => item.kind === "game" && item.game.slug === "diablo-2-evolution",
        });

        expect(getItemHref(games!.results[0]!.item)).toBe("/game/diablo-2-evolution");
    });

    it("keeps two letter queries free of substring noise", () => {
        expect(summary(runSearch(prepared, "le"))).toEqual([["games", ["/game/last-epoch"]]]);
        expect(summary(runSearch(prepared, "po"))).toEqual([
            [
                "games",
                [
                    "/game/path-of-exile",
                    "/game/path-of-exile2",
                    "/game/path-of-diablo",
                    "/game/path-of-terraria",
                ],
            ],
        ]);
    });

    it.each([
        ["community", "/dashboard/community"],
        ["early access", "/dashboard/early-access"],
        ["non seasonal", "/dashboard/non-seasonal"],
    ])("%s offers the %s tab", (query, href) => {
        const actions = runSearch(prepared, query).find((g) => g.id === "actions")!;

        expect(getItemHref(actions.results[0]!.item)).toBe(href);
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
