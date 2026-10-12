import { buildSeasonTerms } from "@/lib/seasonTerms";

import { hasSeasonHistory } from "./(hub)/timeline/timeline";

export type HubTabId = "overview" | "timeline" | "news" | "guides" | "stats";

export interface HubTab {
    id: HubTabId;
    label: string;
    href: string;
}

export interface HubTabFlags {
    hasNews?: boolean;
    hasTimeline?: boolean;
    hasGuides?: boolean;
    hasStats?: boolean;
}

// Fewer tracked seasons than this make averages and ranges meaningless
export const MIN_STATS_SEASONS = 3;

export const hasSeasonStats = (
    game: { categories?: string[]; isComingSoon?: boolean | null },
    trackedCount: number,
): boolean => hasSeasonHistory(game) && trackedCount >= MIN_STATS_SEASONS;

// Seasonal games with enough history get league stats; other released games get Steam players only
export const hasStatsTab = (
    game: { categories?: string[]; isComingSoon?: boolean | null },
    hasSteam: boolean,
    trackedCount: number,
): boolean => hasSeasonStats(game, trackedCount) || (!game.isComingSoon && hasSteam);

// Route segment under (hub) for each tab; Overview is the bare game route.
const TAB_SEGMENTS: Record<HubTabId, string | null> = {
    overview: null,
    timeline: "timeline",
    news: "news",
    guides: "resources",
    stats: "stats",
};

const TAB_LABELS: Record<HubTabId, string> = {
    overview: "Overview",
    timeline: "Timeline",
    news: "News",
    guides: "Guides",
    stats: "Stats",
};

export const getHubTabs = (
    gameSlug: string,
    { hasNews = true, hasTimeline = false, hasGuides = false, hasStats = false }: HubTabFlags = {},
): HubTab[] => {
    const ids: HubTabId[] = [
        "overview",
        ...(hasTimeline ? ["timeline" as const] : []),
        ...(hasNews ? ["news" as const] : []),
        ...(hasGuides ? ["guides" as const] : []),
        ...(hasStats ? ["stats" as const] : []),
    ];

    return ids.map((id) => {
        const segment = TAB_SEGMENTS[id];
        return {
            id,
            label: TAB_LABELS[id],
            href: segment ? `/game/${gameSlug}/${segment}` : `/game/${gameSlug}`,
        };
    });
};

export const getStatsPath = (gameSlug: string): string => `/game/${gameSlug}/stats`;

export const getActiveHubTab = (segment: string | null): HubTabId =>
    (Object.entries(TAB_SEGMENTS).find(([, s]) => s !== null && s === segment)?.[0] as
        HubTabId | undefined) ?? "overview";

interface StatusSeason {
    _id?: string;
    name?: string | null;
    start?: {
        startDate?: string | null;
        confirmed?: boolean | null;
        overrideText?: string | null;
    } | null;
    end?: { endDate?: string | null; confirmed?: boolean | null } | null;
}

interface StatusGame {
    seasonKeyword: string;
    isDormant?: boolean;
    isComingSoon?: boolean;
    currentSeason?: StatusSeason | null;
    nextSeason?: StatusSeason | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Editor-written start text; the parser's "To be announced" and "Avg." fallbacks don't count
export const getEditorStartText = (
    start: { overrideText?: string | null } | null | undefined,
): string | null => {
    const text = start?.overrideText;
    return text && text !== "To be announced" && !text.startsWith("Avg. ") ? text : null;
};

const isPast = (date: string | null | undefined, now: Date) =>
    !!date && new Date(date).getTime() <= now.getTime();

const isFuture = (date: string | null | undefined, now: Date) =>
    !!date && new Date(date).getTime() > now.getTime();

// Parser fills an unannounced next season with a placeholder sharing the current id
export const isPlaceholderNext = (
    current: { _id?: string } | null | undefined,
    next: { _id?: string } | null | undefined,
): boolean => !next || (!!current && next._id === current._id);

export const formatMonthYear = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

const formatDaysLeft = (msLeft: number) => {
    const days = Math.floor(msLeft / DAY_MS);
    if (days < 1) return "ends today";
    return `${days} ${days === 1 ? "day" : "days"} left`;
};

// Mirrors the dashboard: only confirmed dates produce a countdown or days left.
// Two groups (current, next) so the header can put each on its own line on mobile.
export const buildHubStatusLines = (
    game: StatusGame,
    now: Date,
    formatDate: (iso: string) => string,
): string[][] => {
    const parts: string[] = [];
    const nextParts: string[] = [];
    const kw = buildSeasonTerms(game.seasonKeyword).one;
    const current = game.currentSeason;
    const next = game.nextSeason;

    if (game.isDormant) {
        parts.push("No recent updates");
        const last = current?.start?.startDate;
        if (last && isPast(last, now)) parts.push(`last update ${formatMonthYear(last)}`);
    } else if (!game.isComingSoon && current?.name && isPast(current.start?.startDate, now)) {
        parts.push(current.name);
        // Parser sets the end to a confirmed next start
        const endConfirmed = current.end?.confirmed || next?.start?.confirmed;
        if (endConfirmed && isFuture(current.end?.endDate, now)) {
            parts.push(formatDaysLeft(new Date(current.end!.endDate!).getTime() - now.getTime()));
        }
    }

    const nextLabel = game.isComingSoon ? "release" : `next ${kw}`;

    if (!next || isPlaceholderNext(current, next)) {
        // Dormant games are unlikely to get one, so don't mention it
        if (!game.isDormant) nextParts.push(`${nextLabel} not announced yet`);
    } else if (next.start?.confirmed && isFuture(next.start.startDate, now)) {
        nextParts.push(`${next.name ?? nextLabel} starts ${formatDate(next.start.startDate!)}`);
    } else if (!next.start?.confirmed) {
        const editorText = getEditorStartText(next.start);
        nextParts.push(`${next.name ?? nextLabel}: ${editorText ?? "date not announced"}`);
    }

    return [parts, nextParts].filter((line) => line.length > 0);
};

export const buildHubStatus = (
    game: StatusGame,
    now: Date,
    formatDate: (iso: string) => string,
): string[] => buildHubStatusLines(game, now, formatDate).flat();
