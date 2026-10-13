import type { Game } from "@/lib/cms/games.types";
import type { GameFilterCategory } from "@/lib/cms/gameTags";
import { DAY, HOUR } from "@/lib/date";
import { GRACE_PERIOD } from "@/lib/games/sortBySeasons";
import type { GameFiltersStorage } from "@/lib/storage/gameFiltersStorage";

export const STARTING_SOON_WINDOW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export type HiddenReason =
    "No recent updates" | "Community" | "Non-seasonal" | "Hidden by your filters";

export type HiddenGame = {
    game: Game;
    reason: HiddenReason;
    startsInDays: number | null;
    confirmed: boolean;
    // Start of a season inside the grid's grace period
    startedAt: number | null;
};

export type HiddenGamesSummary = {
    now: number;
    state: "preset" | "custom" | "all-shown";
    hiddenCount: number;
    hidden: HiddenGame[];
    justStarted: HiddenGame[]; // newest first
    startingSoon: HiddenGame[];
    others: HiddenGame[];
};

// The Featured preset hides every game with a default reason
const getDefaultHiddenReason = (
    g: Game,
): Exclude<HiddenReason, "Hidden by your filters"> | null => {
    if (g.isDormant) return "No recent updates";
    if (g.categories?.includes("community")) return "Community";
    if (
        !g.categories?.includes("seasonal") &&
        !g.categories?.includes("early-access") &&
        !g.nextSeason?.start?.confirmed
    )
        return "Non-seasonal";
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

// A confirmed next start that passed counts too: games are parsed once per page load
const getStartedAt = (game: Game, now: number): number | null => {
    if (game.isDormant) return null;
    const next = game.nextSeason?.start;
    const current = game.currentSeason;
    const candidates = [
        next?.confirmed ? next.startDate : null,
        current?.end?.endDate && new Date(current.end.endDate).getTime() <= now
            ? null
            : current?.start?.startDate,
    ];
    for (const date of candidates) {
        const start = date ? new Date(date).getTime() : NaN;
        if (start < now && now - start < GRACE_PERIOD) return start;
    }
    return null;
};

const toHiddenGame = (game: Game, now: number): HiddenGame => {
    const startDate = game.isDormant ? null : game.nextSeason?.start?.startDate;
    return {
        game,
        reason: getDefaultHiddenReason(game) ?? "Hidden by your filters",
        startsInDays: startDate ? daysUntil(new Date(startDate).getTime(), now) : null,
        confirmed: !!game.nextSeason?.start?.confirmed,
        startedAt: getStartedAt(game, now),
    };
};

// Unconfirmed dates are placeholders the grid never shows, so they don't count
const isStartingSoon = ({ startsInDays, confirmed }: HiddenGame) =>
    confirmed &&
    startsInDays !== null &&
    startsInDays >= 0 &&
    startsInDays <= STARTING_SOON_WINDOW_DAYS;

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
        .map((g) => toHiddenGame(g, now))
        // Games with no recent updates go last; sort is stable
        .sort((a, b) => Number(!!a.game.isDormant) - Number(!!b.game.isDormant));
    const justStarted = hidden
        .filter((h) => h.startedAt !== null)
        .sort((a, b) => b.startedAt! - a.startedAt!);
    const startingSoon = hidden
        .filter((h) => !justStarted.includes(h) && isStartingSoon(h))
        .sort((a, b) => startTime(a) - startTime(b));

    return {
        now,
        state: isPreset ? "preset" : hidden.length === 0 ? "all-shown" : "custom",
        hiddenCount: hidden.length,
        hidden,
        justStarted,
        startingSoon,
        others: hidden.filter((h) => !justStarted.includes(h) && !startingSoon.includes(h)),
    };
};

const gamesHidden = (count: number) => `${count} ${count === 1 ? "game" : "games"} hidden`;

export const getMobilePresetTabLabel = ({ state, hiddenCount }: HiddenGamesSummary): string => {
    // Kept short: the dashboard selector already names Featured, and the tab must clear it
    if (state === "all-shown") return "All games shown";
    return state === "preset" ? gamesHidden(hiddenCount) : `${hiddenCount} hidden by you`;
};

export type StripEntries = { chips: HiddenGame[]; more: HiddenGame[]; moreLabel: string | null };

// Chips past the cap fold into "+N more"; with no chips, one entry covers all hidden
export const getStripEntries = (
    { hiddenCount, hidden, justStarted, startingSoon, others }: HiddenGamesSummary,
    cap: number,
): StripEntries => {
    const lead = [...justStarted, ...startingSoon];
    if (lead.length === 0) {
        return {
            chips: [],
            more: hidden,
            moreLabel: hidden.length > 0 ? gamesHidden(hiddenCount) : null,
        };
    }
    const more = [...lead.slice(cap), ...others];
    return {
        chips: lead.slice(0, cap),
        more,
        moreLabel: more.length > 0 ? `+${more.length} more` : null,
    };
};

// Same wording as the grid's grace-period text, shortened for a chip
export const getStripTimeLabel = ({ game, startedAt, startsInDays }: HiddenGame, now: number) => {
    if (startedAt !== null) {
        const hours = (now - startedAt) / HOUR;
        return hours < 2 ? "just started" : `started ${hours.toFixed(0)}h ago`;
    }
    const untilStart = new Date(game.nextSeason?.start?.startDate ?? NaN).getTime() - now;
    return untilStart < DAY ? `in ${Math.ceil(untilStart / HOUR)}h` : `in ${startsInDays}d`;
};

export const getHiddenByFiltersLabel = ({ hiddenCount }: HiddenGamesSummary): string =>
    hiddenCount === 1
        ? "1 game is hidden by filters"
        : `${hiddenCount} games are hidden by filters`;
