import { GameDetailsQueryResult } from "@/lib/cms/queries/indexQuery";

import { ArchivalSeason, GameStatistics, LocalSeason, SeasonDuration } from "./types";

export const calculateAveragePerYear = (gameSeasons: LocalSeason[]): string => {
    if (gameSeasons.length < 2) return "N/A";

    const seasonsWithConfirmedDates = gameSeasons.filter(
        (s) => s?.start?.startDate && s?.start?.confirmed,
    );
    if (seasonsWithConfirmedDates.length < 2) return "N/A";

    const sortedSeasons = seasonsWithConfirmedDates.sort((a, b) => {
        const aDate = a?.start?.startDate ? new Date(a.start.startDate).getTime() : 0;
        const bDate = b?.start?.startDate ? new Date(b.start.startDate).getTime() : 0;
        return aDate - bDate;
    });

    let totalDays = 0;
    let count = 0;

    for (let i = 0; i < sortedSeasons.length - 1; i++) {
        const currentStartDate = sortedSeasons[i]?.start?.startDate;
        const nextStartDate = sortedSeasons[i + 1]?.start?.startDate;
        if (!currentStartDate || !nextStartDate) continue;

        const current = new Date(currentStartDate);
        const next = new Date(nextStartDate);
        const daysBetween = Math.ceil((next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
        totalDays += daysBetween;
        count++;
    }

    if (count === 0) return "N/A";

    const avgDaysBetweenSeasons = totalDays / count;
    return (365 / avgDaysBetweenSeasons).toFixed(2);
};

export const calculateUsualStartTime = (gameSeasons: LocalSeason[]): string => {
    if (gameSeasons.length === 0) return "N/A";

    const seasonsWithConfirmedStartTimes = gameSeasons.filter(
        (s) => s?.start?.startDate && s?.start?.confirmed,
    );
    if (seasonsWithConfirmedStartTimes.length === 0) return "N/A";

    const startHours = seasonsWithConfirmedStartTimes
        .map((s) => s?.start?.startDate)
        .filter((d): d is string => typeof d === "string")
        .map((d) => {
            const utcDate = new Date(d);
            return utcDate.getUTCHours();
        });

    const hourCounts = startHours.reduce(
        (acc, hour) => {
            acc[hour] = (acc[hour] || 0) + 1;
            return acc;
        },
        {} as Record<number, number>,
    );

    const mostCommonHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0];

    if (!mostCommonHour) return "N/A";

    const utcHour = parseInt(mostCommonHour[0]);
    const utcDate = new Date();
    utcDate.setUTCHours(utcHour, 0, 0, 0);
    return utcDate.toISOString();
};

export const calculateSeasonDurations = (gameSeasons: LocalSeason[]): SeasonDuration[] => {
    const completedSeasons = gameSeasons.filter(
        (s) => s?.start?.startDate && s?.start?.confirmed && s?.end?.endDate && s?.end?.confirmed,
    );

    return completedSeasons
        .map((s) => {
            if (!s?.start?.startDate || !s?.end?.endDate) return null;
            const start = new Date(s.start.startDate);
            const end = new Date(s.end.endDate);
            return {
                duration: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
                name: s.name || "Unknown",
            };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null);
};

export const calculateGameStatistics = (
    data: GameDetailsQueryResult,
    gameSlug: string,
): GameStatistics => {
    const gameSeasons = data.seasons.filter((s) => s?.game === gameSlug);

    const seasonDurations = calculateSeasonDurations(gameSeasons);

    if (seasonDurations.length === 0) {
        return {
            averagePerYear: "N/A",
            usualStartTime: "N/A",
            maxDuration: { days: "N/A", name: "N/A" },
            minDuration: { days: "N/A", name: "N/A" },
        };
    }

    const maxSeason = seasonDurations.reduce((max, season) =>
        season.duration > max.duration ? season : max,
    );

    const minSeason = seasonDurations.reduce((min, season) =>
        season.duration < min.duration ? season : min,
    );

    return {
        averagePerYear: calculateAveragePerYear(gameSeasons),
        usualStartTime: calculateUsualStartTime(gameSeasons),
        maxDuration: { days: `${maxSeason.duration} days`, name: maxSeason.name },
        minDuration: { days: `${minSeason.duration} days`, name: minSeason.name },
    };
};

export const getOldestSeasonInfo = (data: GameDetailsQueryResult, gameSlug: string): string => {
    const gameSeasons = data.seasons.filter((s) => s?.game === gameSlug);
    if (gameSeasons.length === 0) return "No season data available";

    const seasonsWithConfirmedStartDates = gameSeasons.filter(
        (s) => s?.start?.startDate && s?.start?.confirmed,
    );
    if (seasonsWithConfirmedStartDates.length === 0)
        return "No confirmed season start dates available";

    const oldestSeason = seasonsWithConfirmedStartDates.reduce((oldest, season) => {
        if (!season?.start?.startDate || !oldest?.start?.startDate) return oldest || season;
        const currentDate = new Date(season.start.startDate);
        const oldestDate = new Date(oldest.start.startDate);
        return currentDate < oldestDate ? season : oldest;
    });

    if (!oldestSeason?.start?.startDate) return "No valid season data available";

    const oldestDate = new Date(oldestSeason.start.startDate);
    const formattedOldestDate = oldestDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return `Calculations based on ${seasonsWithConfirmedStartDates.length} confirmed historical entries. Oldest season in aRPG Timeline's archive started ${formattedOldestDate}.`;
};

export const getArchivalSeasons = (
    data: GameDetailsQueryResult,
    gameSlug: string,
): ArchivalSeason[] => {
    const gameSeasons = data.seasons.filter((s) => s?.game === gameSlug);

    return gameSeasons
        .filter(
            (s) =>
                s?.start?.startDate &&
                s?.start?.confirmed &&
                new Date(s.start.startDate) < new Date(),
        )
        .filter((s) => s.start?.startDate && new Date(s.start.startDate) < new Date())
        .sort(
            (a, b) =>
                new Date(b.start!.startDate!).getTime() - new Date(a.start!.startDate!).getTime(),
        )
        .slice(1)
        .map((season) => {
            const startDate = new Date(season.start!.startDate!);
            const endDate =
                season.end?.endDate && season.end?.confirmed ? new Date(season.end.endDate) : null;

            const duration = endDate
                ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                : null;

            if (endDate && endDate > new Date()) {
                return null;
            }

            return {
                name: season.name || "Unknown",
                startDate,
                endDate,
                duration,
                url: season.url,
                patchNotesUrl: season.patchNotesUrl,
            };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null)
        .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
};
