import { NextRequest, NextResponse } from "next/server";

import { createAuthResponse, verifyTokenWithScopes } from "@/lib/auth/jwt";
import { logApiUsage } from "@/lib/auth/logUsageStats";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { addUTMParameters } from "@/lib/utm";
import { ApiErrorResponse, GameSeasonsApiResponse } from "@/types/api";

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_medium: "api",
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse<GameSeasonsApiResponse | ApiErrorResponse>> {
    const { payload, hasAccess } = await verifyTokenWithScopes(request, [
        "read_active_seasons",
        "read_all_seasons", // TODO implement all seasons scope
    ]);

    if (!payload) {
        return createAuthResponse("Missing or invalid token");
    }

    if (!hasAccess) {
        return createAuthResponse(
            "Insufficient permissions. Required scope: read_active_seasons or read_all_seasons",
        );
    }

    await logApiUsage(payload.clientId);

    try {
        const { searchParams } = new URL(request.url);
        const scope = searchParams.get("scope");

        if (scope !== "active") {
            return NextResponse.json(
                { error: "Only 'active' scope is supported at the moment" },
                { status: 400 },
            );
        }

        const resolvedParams = await params;
        const data: IndexQueryResult = await sanityFetch({
            query: indexQuery,
            revalidate: 3600,
            tags: ["game", "season"],
        });

        const games = parseGamesFromSanity(data);
        const game = games.find((g) => g.slug === resolvedParams.slug);

        if (!game) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        const response: GameSeasonsApiResponse = {
            current: null,
            next: null,
        };

        if (game.currentSeason && game.currentSeason.start?.confirmed) {
            response.current = {
                id: game.currentSeason._id,
                lastModified: game.currentSeason._updatedAt,
                name: game.currentSeason.name || "",
                game: game.slug,
                url: game.currentSeason.url ? addUTM(game.currentSeason.url) : null,
                patchNotesUrl: game.currentSeason.patchNotesUrl
                    ? addUTM(game.currentSeason.patchNotesUrl)
                    : null,
                start: game.currentSeason.start?.startDate || null,
                end: game.currentSeason.end?.confirmed
                    ? game.currentSeason.end?.endDate || null
                    : null,
            };
        }

        if (game.nextSeason && game.nextSeason.start?.confirmed) {
            response.next = {
                id: game.nextSeason._id,
                lastModified: game.nextSeason._updatedAt,
                name: game.nextSeason.name || "",
                game: game.slug,
                url: game.nextSeason.url ? addUTM(game.nextSeason.url) : null,
                patchNotesUrl: game.nextSeason.patchNotesUrl
                    ? addUTM(game.nextSeason.patchNotesUrl)
                    : null,
                start: game.nextSeason.start?.startDate || null,
                end: game.nextSeason.end?.confirmed ? game.nextSeason.end?.endDate || null : null,
            };
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching game seasons:", error);
        return NextResponse.json({ error: "Failed to fetch game seasons" }, { status: 500 });
    }
}

export const revalidate = 3600;
