import { decodeSearchIndex, EncodedSearchIndex } from "./searchIndexCodec";
import { SearchIndex } from "./types";

export const SEARCH_INDEX_URL = "/search/index";

let cached: Promise<SearchIndex> | null = null;

export const loadSearchIndex = (): Promise<SearchIndex> => {
    cached ??= fetch(SEARCH_INDEX_URL)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Search index request failed: ${res.status}`);
            }
            return res.json() as Promise<EncodedSearchIndex>;
        })
        .then(decodeSearchIndex)
        .catch((error) => {
            cached = null;
            throw error;
        });
    return cached;
};

export const prefetchSearchIndex = () => {
    loadSearchIndex().catch(() => {});
};
