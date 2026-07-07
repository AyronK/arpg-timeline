import { NextRequest, NextResponse } from "next/server";

import { searchUpcomingGames } from "@/lib/igdb/searchUpcomingGames";
import { getClientKey, isRateLimited } from "@/lib/security/rateLimit";
import { isSameOriginRequest } from "@/lib/security/sameOriginGuard";

export async function GET(request: NextRequest) {
    if (!isSameOriginRequest(request)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (isRateLimited(getClientKey(request))) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

    try {
        const games = await searchUpcomingGames(query);
        return NextResponse.json({ games });
    } catch (error) {
        console.error("Failed to search upcoming games:", error);
        return NextResponse.json({ error: "Failed to search upcoming games" }, { status: 500 });
    }
}

export const runtime = "nodejs";
