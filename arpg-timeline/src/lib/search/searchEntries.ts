import { toGameCandidate } from "./aliases";
import { prepareCandidates, PreparedCandidate, searchCandidates, SearchMatch } from "./match";
import { normalize } from "./normalize";
import { isEntryAvailable, QUICK_LINK_IDS, STATIC_ENTRIES, StaticEntry } from "./staticEntries";
import { SearchGame } from "./types";

export type SearchItem = { kind: "game"; game: SearchGame } | { kind: "entry"; entry: StaticEntry };

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

const asMatch = (entry: StaticEntry): SearchMatch<SearchItem> => ({
    item: { kind: "entry", entry },
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
    item.kind === "game" || isEntryAvailable(item.entry, canOpenFilters);

export const runSearch = (
    prepared: PreparedSearch,
    query: string,
    { canOpenFilters = false, isVisible }: SearchOptions = {},
): SearchGroup[] => {
    const available = (matches: SearchMatch<SearchItem>[]) =>
        matches.filter((match) => isAvailable(match.item, canOpenFilters));

    if (!normalize(query)) {
        return [
            {
                id: "quick-links",
                label: "Quick links",
                results: available(QUICK_LINKS.map(asMatch)),
            },
        ];
    }

    const groups: SearchGroup[] = [
        {
            id: "games",
            label: "Games",
            results: searchCandidates(prepared.games, query, isVisible).slice(
                0,
                GROUP_LIMITS.games,
            ),
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
            results: available(searchCandidates(prepared.actions, query)).slice(
                0,
                GROUP_LIMITS.actions,
            ),
        },
    ];
    return groups.filter((group) => group.results.length > 0);
};

export const getItemHref = (item: SearchItem) =>
    item.kind === "game" ? `/game/${item.game.slug}` : item.entry.href;

export const isItemExternal = (item: SearchItem) => item.kind === "entry" && !!item.entry.external;

export const getItemKey = (item: SearchItem) =>
    item.kind === "game" ? `game:${item.game.slug}` : `entry:${item.entry.id}`;
