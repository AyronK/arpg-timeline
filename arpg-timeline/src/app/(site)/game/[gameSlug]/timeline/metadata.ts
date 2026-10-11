import { SeasonTerms } from "@/lib/seasonTerms";

export interface TimelineMetaInput {
    gameName: string;
    shortName?: string | null;
    terms: SeasonTerms;
    currentName?: string | null;
    next?: { name: string; label: string } | null;
    count: number;
    firstYear: number | null;
}

const MAX_TITLE = 70;
const MAX_DESCRIPTION = 160;
const SUFFIX = "| aRPG Timeline";

export const buildTimelineTitle = ({ gameName, terms }: TimelineMetaInput): string => {
    const full = `${gameName} ${terms.Many}: History, Dates & Timeline ${SUFFIX}`;
    return full.length <= MAX_TITLE ? full : `${gameName} ${terms.One} Timeline ${SUFFIX}`;
};

export const buildTimelineDescription = (input: TimelineMetaInput): string => {
    const { gameName, terms, currentName, next, count, firstYear } = input;
    const archive =
        count > 0 && firstYear
            ? `the full archive of ${count} ${terms.many} since ${firstYear}`
            : `the full ${terms.one} archive`;
    const live = currentName ? `current ${terms.one} (${currentName})` : null;
    const upcoming = next ? `next ${terms.one} start date (${next.label})` : null;

    const sentence = (parts: (string | null)[]) => {
        const items = parts.filter(Boolean) as string[];
        const list =
            items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items.at(-1)}` : items[0];
        return `All ${gameName} ${terms.many}: ${list}.`;
    };
    const extra = " Start dates and duration.";

    const candidates = [[live, upcoming, archive], [live, archive], [archive]].flatMap((parts) => {
        const base = sentence(parts);
        return [base + extra, base];
    });

    return (
        candidates.find((c) => c.length <= MAX_DESCRIPTION) ??
        `All ${gameName} ${terms.many} with start dates and duration.`
    );
};

export const buildTimelineKeywords = ({
    gameName,
    shortName,
    terms,
}: TimelineMetaInput): string[] => {
    const names = [gameName, ...(shortName && shortName !== gameName ? [shortName] : [])];

    return [
        ...names.flatMap((n) => [
            `${n} ${terms.many}`,
            `${n} ${terms.one} history`,
            `${n} ${terms.one} dates`,
            `${n} all ${terms.many}`,
            `${n} past ${terms.many}`,
            `${n} previous ${terms.many}`,
            `${n} current ${terms.one}`,
            `${n} ${terms.one} release dates`,
            `${n} ${terms.one} length`,
            `${n} ${terms.one} timeline`,
        ]),
        "arpg timeline",
    ];
};
