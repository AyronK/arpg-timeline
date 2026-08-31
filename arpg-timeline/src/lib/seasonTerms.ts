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

export const buildSeasonTerms = (seasonKeyword?: string | null): SeasonTerms => {
    const one = seasonKeyword?.trim() || DEFAULT_SEASON_KEYWORD;
    const many = `${one}s`;
    return {
        one,
        many,
        One: capitalizeFirstChar(one),
        Many: capitalizeFirstChar(many),
    };
};
