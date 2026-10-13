import type { Game } from "@/lib/cms/games.types";
import type { GameFilterCategory } from "@/lib/cms/gameTags";
import type { GameFiltersStorage } from "@/lib/storage/gameFiltersStorage";

const isInFeaturedPreset = (g: Game) =>
    g.isDormant ||
    g.categories?.includes("community") ||
    (!g.categories?.includes("seasonal") &&
        !g.categories?.includes("early-access") &&
        !g.nextSeason?.start?.confirmed);

const getFeaturedPreset = (games: Game[]): string[] =>
    games.filter(isInFeaturedPreset).map((g) => g.slug);

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
