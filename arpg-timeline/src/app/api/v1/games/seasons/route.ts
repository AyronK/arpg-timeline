import { NextRequest, NextResponse } from "next/server";

import { createAuthResponse, verifyTokenWithScopes } from "@/lib/auth/jwt";
import { logApiUsage } from "@/lib/auth/logUsageStats";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { AllSeasonsApiResponse, ApiErrorResponse, GameSeasonEntry } from "@/types/api";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<AllSeasonsApiResponse | ApiErrorResponse>> {
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

    try {
        const { searchParams } = new URL(request.url);
        const scope = searchParams.get("scope");

        if (scope !== "active") {
            return NextResponse.json(
                { error: "Only 'active' scope is supported at the moment" },
                { status: 400 },
            );
        }

        await logApiUsage(payload.clientId);

        const data: IndexQueryResult = await sanityFetch({
            query: indexQuery,
            revalidate: 3600,
            tags: ["game", "season"],
        });

        const games = parseGamesFromSanity(data);

        const seasons: GameSeasonEntry[] = games
            .filter((game) => game.currentSeason || game.nextSeason)
            .map((game) => {
                const result: GameSeasonEntry = {
                    game: game.slug,
                    current: null,
                    next: null,
                };

                if (game.currentSeason && game.currentSeason.start?.confirmed) {
                    result.current = {
                        name: game.currentSeason.name || "",
                        game: game.slug,
                        url: game.currentSeason.url || null,
                        patchNotesUrl: game.currentSeason.patchNotesUrl || null,
                        start: game.currentSeason.start?.startDate || null,
                        end: game.currentSeason.end?.confirmed
                            ? game.currentSeason.end?.endDate || null
                            : null,
                    };
                }

                if (game.nextSeason && game.nextSeason.start?.confirmed) {
                    result.next = {
                        name: game.nextSeason.name || "",
                        game: game.slug,
                        url: game.nextSeason.url || null,
                        patchNotesUrl: game.nextSeason.patchNotesUrl || null,
                        start: game.nextSeason.start?.startDate || null,
                        end: game.nextSeason.end?.confirmed
                            ? game.nextSeason.end?.endDate || null
                            : null,
                    };
                }

                return result;
            });

        return NextResponse.json({ seasons });
    } catch (error) {
        console.error("Error fetching all seasons:", error);
        return NextResponse.json({ error: "Failed to fetch seasons" }, { status: 500 });
    }
}

export const revalidate = 3600;
