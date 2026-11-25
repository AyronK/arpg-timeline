import { normalize, normalizeWithMap, squash } from "./normalize";

export const MATCH_TIER = {
    exact: 6,
    prefix: 5,
    wordPrefix: 4,
    substring: 3,
    subsequence: 2,
    typo: 1,
} as const;

const TIER_WEIGHT = 10;
const ALIAS_PENALTY = 1;
const MIN_LOOSE_QUERY_LENGTH = 3;
const MIN_SUBSEQUENCE_QUERY_LENGTH = 4;
const MAX_SUBSEQUENCE_SPREAD = 2;
const MAX_ABBREVIATION_LENGTH = 4;

export interface SearchCandidate<T> {
    item: T;
    name: string;
    nameVariants?: string[];
    aliases: string[];
}

interface PreparedField {
    text: string;
    squashed: string;
    alias: string | null;
}

export interface PreparedCandidate<T> {
    item: T;
    name: string;
    fields: PreparedField[];
}

export type HighlightRange = [start: number, end: number];

export interface SearchMatch<T> {
    item: T;
    score: number;
    matchedAlias: string | null;
    highlight: HighlightRange | null;
}

const prepareField = (text: string, alias: string | null): PreparedField => {
    const normalized = normalize(text);
    return { text: normalized, squashed: squash(normalized), alias };
};

export const prepareCandidates = <T>(candidates: SearchCandidate<T>[]): PreparedCandidate<T>[] =>
    candidates.map(({ item, name, nameVariants = [], aliases }) => ({
        item,
        name,
        fields: [
            prepareField(name, null),
            ...nameVariants.map((variant) => prepareField(variant, null)),
            ...aliases.map((alias) => prepareField(alias, alias)),
        ],
    }));

const isCompactSubsequence = (needle: string, haystack: string) => {
    const maxEnd = needle.length * MAX_SUBSEQUENCE_SPREAD;
    let i = 0;
    for (let j = 0; j < haystack.length && j < maxEnd; j++) {
        if (haystack[j] === needle[i] && ++i === needle.length) {
            return true;
        }
    }
    return false;
};

const isWithinOneEdit = (a: string, b: string) => {
    if (Math.abs(a.length - b.length) > 1) {
        return false;
    }
    let i = 0;
    let j = 0;
    let edits = 0;
    while (i < a.length && j < b.length) {
        if (a[i] === b[j]) {
            i++;
            j++;
            continue;
        }
        if (++edits > 1) {
            return false;
        }
        if (a.length > b.length) {
            i++;
        } else if (a.length < b.length) {
            j++;
        } else {
            i++;
            j++;
        }
    }
    return edits + (a.length - i) + (b.length - j) <= 1;
};

const isTypoOf = (query: string, text: string) =>
    [-1, 0, 1].some((delta) => isWithinOneEdit(query, text.slice(0, query.length + delta)));

const matchTier = (
    { text, squashed, alias }: PreparedField,
    query: string,
    squashedQuery: string,
) => {
    const isShortQuery = squashedQuery.length < MIN_LOOSE_QUERY_LENGTH;
    if (text === query || squashed === squashedQuery) return MATCH_TIER.exact;
    if (isShortQuery && alias && squashed.length > MAX_ABBREVIATION_LENGTH) return 0;
    if (text.startsWith(query) || squashed.startsWith(squashedQuery)) return MATCH_TIER.prefix;
    if (isShortQuery) return 0;
    if (text.includes(` ${query}`)) return MATCH_TIER.wordPrefix;
    if (text.includes(query) || squashed.includes(squashedQuery)) return MATCH_TIER.substring;
    if (
        squashedQuery.length >= MIN_SUBSEQUENCE_QUERY_LENGTH &&
        squashed[0] === squashedQuery[0] &&
        isCompactSubsequence(squashedQuery, squashed)
    ) {
        return MATCH_TIER.subsequence;
    }
    if (squashedQuery.length >= 4 && isTypoOf(squashedQuery, squashed)) return MATCH_TIER.typo;
    return 0;
};

const wordStartIndex = (text: string, query: string) => {
    if (text.startsWith(query)) {
        return 0;
    }
    const index = text.indexOf(` ${query}`);
    return index >= 0 ? index + 1 : text.indexOf(query);
};

export const getHighlight = (name: string, query: string): HighlightRange | null => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
        return null;
    }
    const { normalized, map } = normalizeWithMap(name);
    const toRange = (start: number, length: number, indexMap: number[]): HighlightRange => [
        indexMap[start]!,
        indexMap[start + length - 1]! + 1,
    ];

    const start = wordStartIndex(normalized, normalizedQuery);
    if (start >= 0) {
        return toRange(start, normalizedQuery.length, map);
    }

    const squashedMap = map.filter((_, i) => normalized[i] !== " ");
    const squashedQuery = squash(normalizedQuery);
    const squashedStart = squash(normalized).indexOf(squashedQuery);
    return squashedStart >= 0 ? toRange(squashedStart, squashedQuery.length, squashedMap) : null;
};

export const searchCandidates = <T>(
    candidates: PreparedCandidate<T>[],
    query: string,
    priority: (item: T) => number = () => 0,
): SearchMatch<T>[] => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
        return [];
    }
    const squashedQuery = squash(normalizedQuery);

    const matches = candidates.flatMap(({ item, name, fields }) => {
        let best: { score: number; alias: string | null } | null = null;
        for (const field of fields) {
            const tier = matchTier(field, normalizedQuery, squashedQuery);
            const score = tier * TIER_WEIGHT - (field.alias ? ALIAS_PENALTY : 0);
            if (tier && (!best || score > best.score)) {
                best = { score, alias: field.alias };
            }
        }
        return best
            ? [
                  {
                      item,
                      name,
                      priority: priority(item),
                      score: best.score,
                      matchedAlias: best.alias,
                      highlight: getHighlight(name, query),
                  },
              ]
            : [];
    });

    return matches
        .sort(
            (a, b) => b.score - a.score || b.priority - a.priority || a.name.localeCompare(b.name),
        )
        .map(({ item, score, matchedAlias, highlight }) => ({
            item,
            score,
            matchedAlias,
            highlight,
        }));
};
