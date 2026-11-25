import { sa_event } from "@/lib/sa_event";

import { SearchItem } from "./searchEntries";

// Interactions only: nothing typed, or derived from what was typed, is ever sent.

export type SearchOpenVia = "click" | "ctrl_k" | "slash";
export type SearchTriggerLocation = "header" | "header_icon" | "card";
export type SearchPageType = "dashboard" | "game" | "other";
export type SearchInput = "keyboard" | "pointer";
export type SearchSelectKind =
    "game" | "page" | "action" | "game_link" | "quick_link" | "chip" | "show" | "full_catalog";

export interface SearchSelection {
    kind: SearchSelectKind;
    target: string;
}

export const getSearchPageType = (pathname: string, hasDashboard: boolean): SearchPageType =>
    hasDashboard ? "dashboard" : pathname.startsWith("/game/") ? "game" : "other";

export const getItemSelection = (item: SearchItem, hasQuery: boolean): SearchSelection => {
    switch (item.kind) {
        case "game":
            return { kind: "game", target: item.game.slug };
        case "game-link":
            return { kind: "game_link", target: `${item.game.slug}:${item.link}` };
        case "entry":
            return { kind: hasQuery ? item.entry.kind : "quick_link", target: item.entry.id };
    }
};

export const trackSearchOpen = (
    via: SearchOpenVia,
    page: SearchPageType,
    trigger?: SearchTriggerLocation,
) => sa_event("search_open", { via, page, ...(trigger && { trigger }) });

export const trackSearchSelect = (
    { kind, target }: SearchSelection,
    input: SearchInput,
    position?: number,
) => sa_event("search_select", { kind, target, input, ...(position && { position }) });

export const trackSearchClose = (typed: boolean, hadNoResults: boolean) =>
    sa_event("search_close", { typed, had_no_results: hadNoResults });

export const createSearchSession = () => {
    let hasSelected = false;
    let hasTyped = false;
    let hadNoResults = false;
    return {
        select: (selection: SearchSelection, input: SearchInput, position?: number) => {
            hasSelected = true;
            trackSearchSelect(selection, input, position);
        },
        markTyped: () => {
            hasTyped = true;
        },
        markNoResults: () => {
            hadNoResults = true;
        },
        close: () => {
            if (!hasSelected) {
                trackSearchClose(hasTyped, hadNoResults);
            }
        },
    };
};
