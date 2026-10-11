export type HubTabId = "overview" | "timeline" | "news" | "guides" | "stats";

export interface HubTab {
    id: HubTabId;
    label: string;
    href: string;
}

interface HubGame {
    slug: string;
    categories?: string[];
    isComingSoon?: boolean;
}

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

const hasSeasonHistory = (game: HubGame) =>
    !!game.categories?.includes("seasonal") && !game.isComingSoon;

export const getHubTabs = (game: HubGame): HubTab[] => {
    const seasonal = hasSeasonHistory(game);
    const ids: HubTabId[] = [
        "overview",
        ...(seasonal ? ["timeline" as const] : []),
        "news",
        "guides",
        ...(seasonal ? ["stats" as const] : []),
    ];

    return ids.map((id) => {
        const segment = TAB_SEGMENTS[id];
        return {
            id,
            label: TAB_LABELS[id],
            href: segment ? `/game/${game.slug}/${segment}` : `/game/${game.slug}`,
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
    start?: { startDate?: string | null; confirmed?: boolean | null } | null;
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

const isPast = (date: string | null | undefined, now: Date) =>
    !!date && new Date(date).getTime() <= now.getTime();

const isFuture = (date: string | null | undefined, now: Date) =>
    !!date && new Date(date).getTime() > now.getTime();

const formatDaysLeft = (msLeft: number) => {
    const days = Math.floor(msLeft / DAY_MS);
    if (days < 1) return "ends today";
    return `${days} ${days === 1 ? "day" : "days"} left`;
};

// Mirrors the dashboard: only confirmed dates produce a countdown or days left.
export const buildHubStatus = (
    game: StatusGame,
    now: Date,
    formatDate: (iso: string) => string,
): string[] => {
    const parts: string[] = [];
    const kw = game.seasonKeyword;
    const current = game.currentSeason;
    const next = game.nextSeason;

    if (game.isDormant) {
        parts.push(`No active ${kw}`);
    } else if (!game.isComingSoon && current?.name && isPast(current.start?.startDate, now)) {
        parts.push(current.name);
        // Parser sets the end to a confirmed next start
        const endConfirmed = current.end?.confirmed || next?.start?.confirmed;
        if (endConfirmed && isFuture(current.end?.endDate, now)) {
            parts.push(formatDaysLeft(new Date(current.end!.endDate!).getTime() - now.getTime()));
        }
    }

    // Parser fills an unannounced next season with a placeholder sharing the current id.
    const isPlaceholder = !next || (!!current && next._id === current._id);
    const nextLabel = game.isComingSoon ? "release" : `next ${kw}`;

    if (isPlaceholder) {
        parts.push(`${nextLabel} not announced yet`);
    } else if (next.start?.confirmed && isFuture(next.start.startDate, now)) {
        parts.push(`${next.name ?? nextLabel} starts ${formatDate(next.start.startDate!)}`);
    } else if (!next.start?.confirmed) {
        parts.push(`${next.name ?? nextLabel}: date not announced`);
    }

    return parts;
};
