import { NextResponse } from "next/server";

import {
    buildIcsHeaders,
    createSeasonEvents,
    createStreamEvents,
    fetchCalendarData,
    generateIcsResponse,
} from "./calendarHelper";

export async function GET(): Promise<NextResponse> {
    try {
        const { seasons, streams } = await fetchCalendarData();

        const seasonEvents = createSeasonEvents(seasons);
        const streamEvents = createStreamEvents(streams);
        const events = [...seasonEvents, ...streamEvents];

        const { error, value } = generateIcsResponse(events);

        if (error || !value) {
            console.error("Error creating ICS events:", error);
            return NextResponse.json({ error: "Failed to generate calendar" }, { status: 500 });
        }

        return new NextResponse(value, {
            status: 200,
            headers: buildIcsHeaders("arpg-timeline"),
        });
    } catch (error) {
        console.error("Error fetching calendar data:", error);
        return NextResponse.json({ error: "Failed to fetch calendar data" }, { status: 500 });
    }
}

export const revalidate = 86400;
