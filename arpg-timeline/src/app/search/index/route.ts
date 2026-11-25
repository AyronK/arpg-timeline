import { NextResponse } from "next/server";

import { searchIndexQuery, SearchIndexQueryResult } from "@/lib/cms/queries/searchIndexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { buildSearchIndex } from "@/lib/search/buildSearchIndex";
import { EncodedSearchIndex } from "@/lib/search/searchIndexCodec";

export async function GET(): Promise<NextResponse<EncodedSearchIndex>> {
    const data: SearchIndexQueryResult = await sanityFetch({
        query: searchIndexQuery,
        tags: ["game"],
    });

    return NextResponse.json(buildSearchIndex(data));
}

export const revalidate = 3600;
