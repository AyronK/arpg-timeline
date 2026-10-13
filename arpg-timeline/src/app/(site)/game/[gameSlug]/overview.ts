import { getArticlePath } from "@/lib/articles/articleUrl";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";
import type { SeasonTerms } from "@/lib/seasonTerms";
import type { GameNewsDbEntry } from "@/types/game-news";

import { isPlaceholderNext } from "./hub";
import type { ArchivalSeason, GameStatistics } from "./types";

export interface RhythmTile {
    value: string;
    text: string;
}

export const formatApproxLength = (days: number): string => {
    if (days >= 45) return `~${Math.round((days / 30.44) * 2) / 2} months`;
    const weeks = Math.max(Math.round(days / 7), 1);
    return `~${weeks} ${weeks === 1 ? "week" : "weeks"}`;
};

export const formatPerYear = (averagePerYear: string): string | null => {
    if (averagePerYear === "N/A") return null;
    const avg = parseFloat(averagePerYear);
    const floor = Math.floor(avg);
    const ceil = Math.ceil(avg);
    return floor === ceil ? `${floor}` : `${floor}-${ceil}`;
};

// recentCount scopes the copy to the last N seasons, where "most" reads wrong
export const buildLengthTile = (
    stats: GameStatistics,
    terms: SeasonTerms,
    recentCount?: number,
): RhythmTile | null => {
    const avg = stats.averageDurationDays;
    if (avg === null) return null;

    let text = `per ${terms.one} on average (${avg} days).`;
    const sd = stats.durationStdDev;
    const { days: min } = stats.minDuration;
    const { days: max } = stats.maxDuration;
    if (recentCount) {
        if (min !== null && max !== null && min !== max) {
            text += ` The last ${recentCount} ran ${min} to ${max} days.`;
        }
    } else if (sd !== null && sd > 0) {
        const low = Math.max(avg - sd, stats.minDuration.days ?? 0);
        const high = Math.min(avg + sd, stats.maxDuration.days ?? avg + sd);
        text += ` Most ran between ${low} and ${high} days.`;
    }

    return { value: formatApproxLength(avg), text };
};

export const buildPerYearTile = (stats: GameStatistics, terms: SeasonTerms): RhythmTile | null => {
    const perYear = formatPerYear(stats.averagePerYear);
    return perYear ? { value: `${perYear} a year`, text: `new ${terms.many} on average.` } : null;
};

export type LatestSource = "Steam" | "Official" | "aRPG Timeline";

export interface LatestItem {
    key: string;
    title: string;
    href: string;
    date: string;
    source: LatestSource;
    external: boolean;
}

export const feedSource = (steamAppId: number | null): LatestSource =>
    steamAppId ? "Steam" : "Official";

const DAY_MS = 24 * 60 * 60 * 1000;
const PIN_ARTICLE_DAYS = 60;

const byDateDesc = (a: { date: string }, b: { date: string }) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

// Newest by date, but our latest article is pinned first while it's under 60 days old.
export const mergeLatest = (
    feed: Pick<GameNewsDbEntry, "id" | "title" | "link" | "pub_date" | "steam_app_id">[],
    articles: Pick<ArticleListItem, "_id" | "title" | "slug" | "category" | "publishedAt">[],
    gameSlug: string,
    limit: number,
    now: Date,
): LatestItem[] => {
    const feedItems: LatestItem[] = feed.map((n) => ({
        key: n.id,
        title: n.title,
        href: n.link,
        date: n.pub_date,
        source: feedSource(n.steam_app_id),
        external: true,
    }));
    const articleItems: LatestItem[] = articles
        .map((a) => ({
            key: a._id,
            title: a.title,
            href: getArticlePath({ category: a.category, slug: a.slug, gameSlug }),
            date: a.publishedAt,
            source: "aRPG Timeline" as const,
            external: false,
        }))
        .sort(byDateDesc);

    const newest = articleItems[0];
    const pinned =
        newest && now.getTime() - new Date(newest.date).getTime() <= PIN_ARTICLE_DAYS * DAY_MS
            ? newest
            : null;
    const rest = [...feedItems, ...articleItems].filter((item) => item !== pinned).sort(byDateDesc);

    return (pinned ? [pinned, ...rest] : rest).slice(0, limit);
};

// UTC on the server so cached HTML matches across visitors; local renders in the browser
const dayFormat = (withYear: boolean, local: boolean): Intl.DateTimeFormatOptions => ({
    month: "short",
    day: "numeric",
    ...(!local && { timeZone: "UTC" }),
    ...(withYear && { year: "numeric" }),
});

export const formatShortDate = (date: Date | string, withYear = false, local = false): string =>
    new Date(date).toLocaleDateString("en-US", dayFormat(withYear, local));

export const formatDateRange = (start: Date, end: Date | null, local = false): string => {
    if (!end) return formatShortDate(start, true, local);
    const year = (d: Date) => (local ? d.getFullYear() : d.getUTCFullYear());
    const sameYear = year(start) === year(end);
    return `${formatShortDate(start, !sameYear, local)} - ${formatShortDate(end, true, local)}`;
};

export const formatSeasonRow = (
    season: Pick<ArchivalSeason, "startDate" | "endDate" | "duration">,
    local = false,
) =>
    [
        formatDateRange(season.startDate, season.endDate, local),
        season.duration && `${season.duration} days`,
    ]
        .filter(Boolean)
        .join(" · ");

// Launches are usually announced at least this far ahead
const ANNOUNCE_LEAD_DAYS = 21;

const partOfMonth = (date: Date) => {
    const day = date.getUTCDate();
    return day <= 10 ? "early" : day <= 20 ? "mid" : "late";
};

// Soft, history-based hint for an unannounced next season; never a concrete date.
export const buildCadenceHint = ({
    currentStart,
    medianDays,
    trackedCount,
    terms,
    now,
}: {
    currentStart: string | null | undefined;
    medianDays: number | null;
    trackedCount: number;
    terms: SeasonTerms;
    now: Date;
}): string | null => {
    if (!currentStart || medianDays === null || trackedCount < 3) return null;

    const estimate = new Date(new Date(currentStart).getTime() + medianDays * DAY_MS);
    if (estimate.getTime() < now.getTime() + ANNOUNCE_LEAD_DAYS * DAY_MS) {
        return `Likely later than usual. Past ${terms.many} were usually announced by now.`;
    }

    const month = estimate.toLocaleDateString("en-US", {
        month: "long",
        timeZone: "UTC",
        ...(estimate.getUTCFullYear() !== now.getUTCFullYear() && { year: "numeric" }),
    });
    return `If it follows past ${terms.many}, expect it around ${partOfMonth(estimate)} ${month}.`;
};

export type StatusLayout = "prelaunch" | "now-next" | null;

// Which cards open the Overview: pre-launch + Release/Next, Now + Next, or none
export const pickStatusLayout = (
    game: {
        isComingSoon?: boolean;
        isDormant?: boolean;
        currentSeason?: { _id?: string } | null;
        nextSeason?: { _id?: string } | null;
    },
    hasSeasons: boolean,
): StatusLayout => {
    const announcedOnly =
        !hasSeasons &&
        !game.isDormant &&
        !!game.nextSeason &&
        !isPlaceholderNext(game.currentSeason, game.nextSeason);
    if (game.isComingSoon || announcedOnly) return "prelaunch";
    if (hasSeasons || game.isDormant) return "now-next";
    return null;
};
