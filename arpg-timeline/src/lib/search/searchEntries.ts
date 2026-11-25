import { addGameLinkUTM } from "@/lib/utm";

import { toGameCandidate } from "./aliases";
import {
    isStrongMatch,
    prepareCandidates,
    PreparedCandidate,
    searchCandidates,
    SearchMatch,
} from "./match";
import { normalize } from "./normalize";
import { isEntryAvailable, QUICK_LINK_IDS, STATIC_ENTRIES, StaticEntry } from "./staticEntries";
import { SearchGame } from "./types";

export type GameLink = "website" | "calendar";

export type SearchItem =
    | { kind: "game"; game: SearchGame }
    | { kind: "game-link"; game: SearchGame; link: GameLink }
    | { kind: "entry"; entry: StaticEntry };

export type SearchGroupId = "games" | "pages" | "actions" | "quick-links";

export interface SearchGroup {
    id: SearchGroupId;
    label: string;
    results: SearchMatch<SearchItem>[];
}

export const GROUP_LIMITS = { games: 6, pages: 3, actions: 3 } as const;

interface PreparedSearch {
    games: PreparedCandidate<SearchItem>[];
    pages: PreparedCandidate<SearchItem>[];
    actions: PreparedCandidate<SearchItem>[];
}

const prepareEntries = (entries: StaticEntry[]) =>
    prepareCandidates(
        entries.map((entry) => ({
            item: { kind: "entry", entry } as SearchItem,
            name: entry.title,
            aliases: entry.keywords,
        })),
    );

const prepareGames = (games: SearchGame[]) =>
    prepareCandidates(
        games.map((game) => ({
            ...toGameCandidate(game),
            item: { kind: "game", game } as SearchItem,
        })),
    );

const preparedEntries = {
    pages: prepareEntries(STATIC_ENTRIES.filter((entry) => entry.kind === "page")),
    actions: prepareEntries(STATIC_ENTRIES.filter((entry) => entry.kind === "action")),
};

const preparedGames = new WeakMap<SearchGame[], PreparedCandidate<SearchItem>[]>();

export const prepareSearch = (games: SearchGame[] | null): PreparedSearch => {
    if (!games) {
        return { games: [], ...preparedEntries };
    }
    let prepared = preparedGames.get(games);
    if (!prepared) {
        prepared = prepareGames(games);
        preparedGames.set(games, prepared);
    }
    return { games: prepared, ...preparedEntries };
};

const asMatch = (item: SearchItem): SearchMatch<SearchItem> => ({
    item,
    score: 0,
    matchedAlias: null,
    highlight: null,
});

const QUICK_LINKS = QUICK_LINK_IDS.map((id) => STATIC_ENTRIES.find((entry) => entry.id === id)!);

interface SearchOptions {
    canOpenFilters?: boolean;
    isVisible?: (item: SearchItem) => boolean;
}

const isAvailable = (item: SearchItem, canOpenFilters: boolean) =>
    item.kind !== "entry" || isEntryAvailable(item.entry, canOpenFilters);

export const isCommunity = (game: SearchGame) => game.categories.includes("community");

const isCommunityGame = (item: SearchItem) => item.kind === "game" && isCommunity(item.game);

const getGameLinks = (top: SearchMatch<SearchItem> | undefined): SearchMatch<SearchItem>[] => {
    if (!top || top.item.kind !== "game" || !isStrongMatch(top.score)) {
        return [];
    }
    const { game } = top.item;
    const links: GameLink[] = game.url ? ["website", "calendar"] : ["calendar"];
    return links.map((link) => asMatch({ kind: "game-link", game, link }));
};

const searchGroups = (
    prepared: PreparedSearch,
    query: string,
    canOpenFilters: boolean,
    priority: (item: SearchItem) => number,
): SearchGroup[] => {
    const available = (matches: SearchMatch<SearchItem>[]) =>
        matches.filter((match) => isAvailable(match.item, canOpenFilters));
    const games = searchCandidates(prepared.games, query, priority).slice(0, GROUP_LIMITS.games);

    const groups: SearchGroup[] = [
        {
            id: "games",
            label: "Games",
            results: games,
        },
        {
            id: "pages",
            label: "Pages",
            results: available(searchCandidates(prepared.pages, query)).slice(
                0,
                GROUP_LIMITS.pages,
            ),
        },
        {
            id: "actions",
            label: "Actions",
            results: [
                ...getGameLinks(games[0]),
                ...available(searchCandidates(prepared.actions, query)),
            ].slice(0, GROUP_LIMITS.actions),
        },
    ];
    return groups.filter((group) => group.results.length > 0);
};

export const runSearch = (
    prepared: PreparedSearch,
    query: string,
    { canOpenFilters = false, isVisible = () => false }: SearchOptions = {},
): SearchGroup[] => {
    const words = normalize(query).split(" ").filter(Boolean);
    if (!words.length) {
        return [
            {
                id: "quick-links",
                label: "Quick links",
                results: QUICK_LINKS.map((entry) => asMatch({ kind: "entry", entry })).filter(
                    (match) => isAvailable(match.item, canOpenFilters),
                ),
            },
        ];
    }

    const priority = (item: SearchItem) =>
        (isVisible(item) ? 2 : 0) + (isCommunityGame(item) ? 0 : 1);

    for (let count = words.length; count > 0; count--) {
        const groups = searchGroups(
            prepared,
            count === words.length ? query : words.slice(0, count).join(" "),
            canOpenFilters,
            priority,
        );
        if (groups.length) {
            return groups;
        }
    }
    return [];
};

export const getItemHref = (item: SearchItem) => {
    switch (item.kind) {
        case "game":
            return `/game/${item.game.slug}`;
        case "game-link":
            return item.link === "website"
                ? addGameLinkUTM("official-website", item.game.slug)(item.game.url ?? "")
                : `/calendar/subscribe/${item.game.slug}`;
        case "entry":
            return item.entry.href;
    }
};

export const isItemExternal = (item: SearchItem) =>
    item.kind === "entry"
        ? !!item.entry.external
        : item.kind === "game-link" && item.link === "website";

export const getItemKey = (item: SearchItem) => {
    switch (item.kind) {
        case "game":
            return `game:${item.game.slug}`;
        case "game-link":
            return `game-link:${item.game.slug}:${item.link}`;
        case "entry":
            return `entry:${item.entry.id}`;
    }
};
