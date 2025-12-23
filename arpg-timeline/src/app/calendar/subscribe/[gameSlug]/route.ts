import { NextResponse } from "next/server";

import {
    buildIcsHeaders,
    createSeasonEvents,
    createStreamEvents,
    fetchAllGameSlugs,
    fetchCalendarData,
    fetchGameBySlug,
    generateIcsResponse,
} from "../calendarHelper";

interface RouteParams {
    params: Promise<{ gameSlug: string }>;
}

export async function generateStaticParams() {
    const games = await fetchAllGameSlugs();

    return games.map((game) => ({
        gameSlug: game.slug,
    }));
}

export async function GET(_request: Request, { params }: RouteParams): Promise<NextResponse> {
    try {
        const { gameSlug } = await params;

        const game = await fetchGameBySlug(gameSlug);
        if (!game) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        const { seasons, streams } = await fetchCalendarData();

        const filteredSeasons = seasons.filter((season) => season.gameSlug === gameSlug);
        const filteredStreams = streams.filter((stream) => stream.gameSlug === gameSlug);

        const seasonEvents = createSeasonEvents(filteredSeasons, game.name);
        const streamEvents = createStreamEvents(filteredStreams, game.name);
        const events = [...seasonEvents, ...streamEvents];

        const { error, value } = generateIcsResponse(events, game.name);

        if (error || !value) {
            console.error("Error creating ICS events:", error);
            return NextResponse.json({ error: "Failed to generate calendar" }, { status: 500 });
        }

        return new NextResponse(value, {
            status: 200,
            headers: buildIcsHeaders(`arpg-timeline-${gameSlug}`),
        });
    } catch (error) {
        console.error("Error fetching calendar data:", error);
        return NextResponse.json({ error: "Failed to fetch calendar data" }, { status: 500 });
    }
}

export const revalidate = false;
