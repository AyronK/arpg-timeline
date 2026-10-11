import { SanityImageAssetDocument } from "next-sanity";

import { SanitySeason } from "@/lib/cms/queries/indexQuery";
import { DAY } from "@/lib/date";

export type TimelineStatus = "live" | "upcoming" | "past";

export interface TimelineEntry {
    id: string;
    name: string;
    logo?: SanityImageAssetDocument;
    url?: string;
    patchNotesUrl?: string;
    isSideEvent: boolean;
    status: TimelineStatus;
    startDate: Date | null;
    startLabel: string;
    localizeStart: boolean;
    durationDays: number | null;
    placeholder?: boolean;
}

export interface TimelineGroup {
    key: string;
    label: string;
    entries: TimelineEntry[];
}

const START_FORMAT = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
});

const START_FORMAT_DAY = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
});

const UPCOMING_KEY = "upcoming";

export const formatApproxMonths = (days: number): string => {
    if (days < 20) return "<1 month";
    const months = Math.max(1, Math.round(days / 30.44));
    return `~${months} month${months === 1 ? "" : "s"}`;
};

const parseDate = (value?: string): Date | null => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const buildStartLabel = (season: SanitySeason, startDate: Date | null): string => {
    if (season.start?.overrideText) return season.start.overrideText;
    if (!startDate) return "TBA";
    return season.start?.confirmed
        ? START_FORMAT_DAY.format(startDate)
        : `${START_FORMAT.format(startDate)} (est.)`;
};

export const buildTimelineEntries = (
    seasons: SanitySeason[],
    gameSlug: string,
    now: Date,
): TimelineEntry[] => {
    const parsed = seasons
        .filter((s) => s.game === gameSlug)
        .map((season) => {
            const startDate = parseDate(season.start?.startDate);
            const confirmedStart = !!season.start?.confirmed && startDate !== null;
            const endDate = season.end?.confirmed ? parseDate(season.end?.endDate) : null;
            return { season, startDate, confirmedStart, endDate };
        });

    const startedMain = parsed
        .filter((p) => p.confirmedStart && p.startDate! <= now && !p.season.isSideEvent)
        .sort((a, b) => b.startDate!.getTime() - a.startDate!.getTime());
    const newestMainId = startedMain[0]?.season._id;

    const newestMainStart = startedMain[0]?.startDate ?? null;

    const entries = parsed.map(({ season, startDate, confirmedStart, endDate }): TimelineEntry => {
        const isSideEvent = !!season.isSideEvent;
        let status: TimelineStatus;
        let end = endDate;

        // Unconfirmed start already overtaken by a newer confirmed season is history, not upcoming
        const isOvertaken =
            !confirmedStart && !!startDate && !!newestMainStart && startDate < newestMainStart;

        if (!isOvertaken && (!confirmedStart || startDate! > now)) {
            status = "upcoming";
        } else {
            if (!end && !isSideEvent) {
                end =
                    startedMain
                        .filter((p) => p.startDate! > startDate!)
                        .map((p) => p.startDate!)
                        .sort((a, b) => a.getTime() - b.getTime())[0] ?? null;
            }
            const isLive = isSideEvent
                ? !!endDate && endDate > now
                : confirmedStart && season._id === newestMainId && (!end || end > now);
            status = isLive ? "live" : "past";
        }

        // Upcoming seasons without a confirmed start show no estimated date
        const hideEstimate = status === "upcoming" && !confirmedStart;

        const durationDays =
            status === "past" && end && startDate
                ? Math.max(1, Math.ceil((end.getTime() - startDate.getTime()) / DAY))
                : null;

        return {
            id: season._id,
            name: season.name,
            logo: season.logo,
            url: season.url,
            patchNotesUrl: season.patchNotesUrl,
            isSideEvent,
            status,
            startDate: hideEstimate ? null : startDate,
            startLabel: buildStartLabel(season, hideEstimate ? null : startDate),
            localizeStart: !season.start?.overrideText && !!season.start?.confirmed && !!startDate,
            durationDays,
        };
    });

    return entries.sort((a, b) => {
        const aUp = a.status === "upcoming";
        const bUp = b.status === "upcoming";
        if (aUp !== bUp) return aUp ? -1 : 1;
        if (!a.startDate && !b.startDate) return 0;
        // Undated upcoming last; dated upcoming soonest first, everything else newest first
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return aUp
            ? a.startDate.getTime() - b.startDate.getTime()
            : b.startDate.getTime() - a.startDate.getTime();
    });
};

export const groupByYear = (entries: TimelineEntry[]): TimelineGroup[] => {
    const groups: TimelineGroup[] = [];

    for (const entry of entries) {
        const isUpcoming = entry.status === "upcoming";
        const key = isUpcoming ? UPCOMING_KEY : String(entry.startDate!.getUTCFullYear());
        const last = groups[groups.length - 1];

        if (last && last.key === key) {
            last.entries.push(entry);
        } else {
            groups.push({ key, label: isUpcoming ? "Next" : key, entries: [entry] });
        }
    }

    return groups;
};

export interface TimelineSummary {
    count: number;
    firstYear: number | null;
    averageDays: number | null;
    next: { name: string; label: string } | null;
}

export const buildTimelineSummary = (entries: TimelineEntry[]): TimelineSummary => {
    const main = entries.filter((e) => !e.isSideEvent && e.status !== "upcoming" && e.startDate);
    const durations = main.map((e) => e.durationDays).filter((d): d is number => d !== null);
    const next = entries.find((e) => e.status === "upcoming" && e.startDate);

    return {
        count: main.length,
        firstYear: main.length ? Math.min(...main.map((e) => e.startDate!.getUTCFullYear())) : null,
        averageDays: durations.length
            ? Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length)
            : null,
        next: next ? { name: next.name, label: next.startLabel } : null,
    };
};

// Adds a "next season" slot when nothing upcoming is tracked yet
export const addNextPlaceholder = (
    entries: TimelineEntry[],
    seasonLabel: string,
): TimelineEntry[] =>
    entries.some((e) => e.status === "upcoming")
        ? entries
        : [
              {
                  id: "next-placeholder",
                  name: `Next ${seasonLabel}`,
                  isSideEvent: false,
                  status: "upcoming",
                  startDate: null,
                  startLabel: "To be announced",
                  localizeStart: false,
                  durationDays: null,
                  placeholder: true,
              },
              ...entries,
          ];
