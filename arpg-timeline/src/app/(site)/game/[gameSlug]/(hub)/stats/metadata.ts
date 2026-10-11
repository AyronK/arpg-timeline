import { SeasonTerms } from "@/lib/seasonTerms";

const MAX_TITLE = 70;
const MAX_DESCRIPTION = 160;
const SUFFIX = "| aRPG Timeline";

export const buildStatsTitle = (gameName: string, terms: SeasonTerms): string => {
    const full = `${gameName} ${terms.One} Statistics: Length & Schedule ${SUFFIX}`;
    return full.length <= MAX_TITLE ? full : `${gameName} ${terms.One} Statistics ${SUFFIX}`;
};

export const buildStatsDescription = (
    gameName: string,
    terms: SeasonTerms,
    stats: { averageDurationDays: number | null; perYear: string | null; count: number },
): string => {
    const facts = [
        stats.averageDurationDays !== null && `${stats.averageDurationDays} days on average`,
        stats.perYear && `${stats.perYear} new ${terms.many} a year`,
    ].filter(Boolean);
    const base = `How long ${gameName} ${terms.many} last and how often they launch`;
    const full = facts.length
        ? `${base}: ${facts.join(", ")}. Based on ${stats.count} ${terms.many}, plus usual launch day and time.`
        : `${base}, based on every tracked ${terms.one}.`;
    return full.length <= MAX_DESCRIPTION ? full : `${base}.`;
};
