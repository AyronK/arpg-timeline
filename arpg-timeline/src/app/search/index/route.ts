import { NextResponse } from "next/server";

import { searchIndexQuery, SearchIndexQueryResult } from "@/lib/cms/queries/searchIndexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { buildSearchIndex } from "@/lib/search/buildSearchIndex";
import { EncodedSearchIndex } from "@/lib/search/searchIndexCodec";

const SEARCH_INDEX_HEADERS = {
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    "X-Robots-Tag": "noindex",
};

export async function GET(): Promise<NextResponse<EncodedSearchIndex>> {
    const data: SearchIndexQueryResult = await sanityFetch({
        query: searchIndexQuery,
        tags: ["game"],
    });

    return NextResponse.json(buildSearchIndex(data), { headers: SEARCH_INDEX_HEADERS });
}

export const revalidate = 3600;
