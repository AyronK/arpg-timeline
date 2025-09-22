import { NextRequest, NextResponse } from "next/server";

import { createAuthResponse, verifyToken } from "@/lib/auth/jwt";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { ApiErrorResponse, GamesApiResponse } from "@/types/api";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<GamesApiResponse | ApiErrorResponse>> {
    const payload = await verifyToken(request);
    if (!payload) {
        return createAuthResponse();
    }
    try {
        const data: IndexQueryResult = await sanityFetch({
            query: indexQuery,
            revalidate: 3600,
        });

        const games = data.games.map((game) => ({
            slug: game.slug,
            name: game.name,
            seasonKeyword: game.seasonKeyword,
        }));

        return NextResponse.json({ games });
    } catch (error) {
        console.error("Error fetching games:", error);
        return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
    }
}

export const revalidate = 3600;
