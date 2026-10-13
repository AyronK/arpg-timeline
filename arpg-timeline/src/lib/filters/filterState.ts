import type { Game } from "@/lib/cms/games.types";
import type { GameFilterCategory } from "@/lib/cms/gameTags";
import type { GameFiltersStorage } from "@/lib/storage/gameFiltersStorage";

export const STARTING_SOON_WINDOW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export type HiddenReason =
    "Dormant" | "Community" | "No confirmed season" | "Hidden by your filters";

export type HiddenGame = {
    game: Game;
    reason: HiddenReason;
    startsInDays: number | null;
    confirmed: boolean;
};

export type HiddenGamesSummary = {
    state: "preset" | "custom" | "all-shown";
    hiddenCount: number;
    hidden: HiddenGame[];
    startingSoon: HiddenGame[];
    others: HiddenGame[];
};

// The Featured preset hides every game with a default reason
const getDefaultHiddenReason = (
    g: Game,
): Exclude<HiddenReason, "Hidden by your filters"> | null => {
    if (g.isDormant) return "Dormant";
    if (g.categories?.includes("community")) return "Community";
    if (
        !g.categories?.includes("seasonal") &&
        !g.categories?.includes("early-access") &&
        !g.nextSeason?.start?.confirmed
    )
        return "No confirmed season";
    return null;
};

const getFeaturedPreset = (games: Game[]): string[] =>
    games.filter((g) => getDefaultHiddenReason(g) !== null).map((g) => g.slug);

type FilterInputs = {
    category: GameFilterCategory;
    stored: GameFiltersStorage | null;
    urlExcludes: string[];
};

export const resolveExcludedSlugs = ({
    category,
    games,
    stored,
    urlExcludes,
}: FilterInputs & { games: Game[] }): string[] => {
    if (category !== "featured") return [];
    if (stored?.category === "featured") return stored.excludedSlugs;
    if (urlExcludes.length > 0) return urlExcludes;
    return getFeaturedPreset(games);
};

// A shared Featured link is saved only when no Featured record exists yet
export const getUrlExcludesToPersist = ({
    category,
    stored,
    urlExcludes,
}: FilterInputs): string[] | null =>
    category === "featured" && stored?.category !== "featured" && urlExcludes.length > 0
        ? urlExcludes
        : null;

// Rounds away from now, so a season that already started is never "in 0d"
const daysUntil = (start: number, now: number) => {
    const days = (start - now) / DAY_MS;
    return days < 0 ? Math.floor(days) : Math.ceil(days);
};

const toHiddenGame = (game: Game, now: number): HiddenGame => {
    const startDate = game.isDormant ? null : game.nextSeason?.start?.startDate;
    return {
        game,
        reason: getDefaultHiddenReason(game) ?? "Hidden by your filters",
        startsInDays: startDate ? daysUntil(new Date(startDate).getTime(), now) : null,
        confirmed: !!game.nextSeason?.start?.confirmed,
    };
};

const isStartingSoon = ({ startsInDays }: HiddenGame) =>
    startsInDays !== null && startsInDays >= 0 && startsInDays <= STARTING_SOON_WINDOW_DAYS;

const startTime = ({ game }: HiddenGame) => new Date(game.nextSeason!.start!.startDate!).getTime();

export const getHiddenGamesSummary = ({
    games,
    excludedSlugs,
    isPreset,
    now,
}: {
    games: Game[];
    excludedSlugs: string[];
    isPreset: boolean;
    now: number;
}): HiddenGamesSummary => {
    const hidden = games
        .filter((g) => excludedSlugs.includes(g.slug))
        .map((g) => toHiddenGame(g, now));
    const startingSoon = hidden.filter(isStartingSoon).sort((a, b) => startTime(a) - startTime(b));

    return {
        state: isPreset ? "preset" : hidden.length === 0 ? "all-shown" : "custom",
        hiddenCount: hidden.length,
        hidden,
        startingSoon,
        others: hidden.filter((h) => !startingSoon.includes(h)),
    };
};

export type PresetControlLabel = { full: string; short: string };

export const getPresetControlLabel = ({
    state,
    hiddenCount,
}: HiddenGamesSummary): PresetControlLabel => {
    if (state === "all-shown") {
        return { full: "Filters · All games shown", short: "Filters · All games shown" };
    }
    const preset = state === "preset" ? "Featured preset" : "Custom";
    return {
        full: `Filters · ${preset} · ${hiddenCount} hidden`,
        short: `Filters · ${hiddenCount} hidden`,
    };
};
