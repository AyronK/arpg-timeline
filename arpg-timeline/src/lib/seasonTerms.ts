import { capitalizeFirstChar } from "@/lib/capitalizeFirstChar";

export interface SeasonTerms {
    /** singular, lowercase - "season", "league", "cycle" */
    one: string;
    /** plural, lowercase - "seasons", "leagues" */
    many: string;
    /** singular, capitalized - "Season", "League" */
    One: string;
    /** plural, capitalized - "Seasons", "Leagues" */
    Many: string;
}

const DEFAULT_SEASON_KEYWORD = "season";

// Covers the keywords in use ("patch", "series", "story"), not full English rules
const pluralize = (word: string): string => {
    if (/(ch|sh|x|z)$/i.test(word)) return `${word}es`;
    if (/s$/i.test(word)) return word;
    if (/[^aeiou]y$/i.test(word)) return `${word.slice(0, -1)}ies`;
    return `${word}s`;
};

export const buildSeasonTerms = (seasonKeyword?: string | null): SeasonTerms => {
    // Lowercase so the keyword reads naturally mid-sentence ("4 content updates tracked")
    const one = seasonKeyword?.trim().toLowerCase() || DEFAULT_SEASON_KEYWORD;
    const many = pluralize(one);
    return {
        one,
        many,
        One: capitalizeFirstChar(one),
        Many: capitalizeFirstChar(many),
    };
};
