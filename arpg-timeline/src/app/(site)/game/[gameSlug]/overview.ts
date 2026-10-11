import { getArticlePath } from "@/lib/articles/articleUrl";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";
import type { SeasonTerms } from "@/lib/seasonTerms";
import type { GameNewsDbEntry } from "@/types/game-news";

import type { ArchivalSeason, GameStatistics } from "./types";

export interface RhythmTile {
    value: string;
    text: string;
}

export const formatApproxLength = (days: number): string =>
    days < 45 ? `~${Math.round(days / 7)} weeks` : `~${Math.round((days / 30.44) * 2) / 2} months`;

export const formatPerYear = (averagePerYear: string): string | null => {
    if (averagePerYear === "N/A") return null;
    const avg = parseFloat(averagePerYear);
    const floor = Math.floor(avg);
    const ceil = Math.ceil(avg);
    return floor === ceil ? `${floor}` : `${floor}-${ceil}`;
};

export const buildLengthTile = (stats: GameStatistics, terms: SeasonTerms): RhythmTile | null => {
    const avg = stats.averageDurationDays;
    if (avg === null) return null;

    let text = `per ${terms.one} on average (${avg} days).`;
    const sd = stats.durationStdDev;
    if (sd !== null && sd > 0) {
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

export const mergeLatest = (
    feed: Pick<GameNewsDbEntry, "id" | "title" | "link" | "pub_date" | "steam_app_id">[],
    articles: Pick<ArticleListItem, "_id" | "title" | "slug" | "category" | "publishedAt">[],
    gameSlug: string,
    limit: number,
): LatestItem[] =>
    [
        ...feed.map((n) => ({
            key: n.id,
            title: n.title,
            href: n.link,
            date: n.pub_date,
            source: feedSource(n.steam_app_id),
            external: true,
        })),
        ...articles.map((a) => ({
            key: a._id,
            title: a.title,
            href: getArticlePath({ category: a.category, slug: a.slug, gameSlug }),
            date: a.publishedAt,
            source: "aRPG Timeline" as const,
            external: false,
        })),
    ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);

const dayFormat = (withYear: boolean): Intl.DateTimeFormatOptions => ({
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...(withYear && { year: "numeric" }),
});

// UTC so server-rendered dates match across visitors.
export const formatShortDate = (date: Date | string, withYear = false): string =>
    new Date(date).toLocaleDateString("en-US", dayFormat(withYear));

export const formatDateRange = (start: Date, end: Date | null): string => {
    if (!end) return formatShortDate(start, true);
    const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
    return `${formatShortDate(start, !sameYear)} - ${formatShortDate(end, true)}`;
};

export const formatSeasonRow = (
    season: Pick<ArchivalSeason, "startDate" | "endDate" | "duration">,
) =>
    [
        formatDateRange(season.startDate, season.endDate),
        season.duration && `${season.duration} days`,
    ]
        .filter(Boolean)
        .join(" · ");

const DAY_MS = 24 * 60 * 60 * 1000;
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
