import { createEvents, DateArray, EventAttributes } from "ics";
import { NextResponse } from "next/server";

import { sanityFetch } from "@/lib/sanity/sanityClient";

interface CalendarSeason {
    _id: string;
    name: string;
    gameName: string;
    startDate: string;
}

interface CalendarStream {
    _id: string;
    name: string;
    gameName: string;
    date: string;
}

const seasonsQuery = `*[_type == "season" && start.confirmed == true && start.startDate > now()]{
    _id,
    name,
    "gameName": game->name,
    "startDate": start.startDate
} | order(start.startDate asc)`;

const streamsQuery = `*[_type == "liveStreamTwitch" && date > now()]{
    _id,
    name,
    "gameName": game->name,
    date
} | order(date asc)`;

function dateToDateArray(dateString: string): DateArray {
    const date = new Date(dateString);
    return [
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
    ];
}

function getEndDateArray(dateString: string): DateArray {
    const date = new Date(dateString);
    date.setUTCHours(date.getUTCHours() + 1);
    return [
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
    ];
}

export async function GET(): Promise<NextResponse> {
    try {
        const [seasons, streams]: [CalendarSeason[], CalendarStream[]] = await Promise.all([
            sanityFetch({
                query: seasonsQuery,
                revalidate: 3600,
                tags: ["season"],
            }),
            sanityFetch({
                query: streamsQuery,
                revalidate: 3600,
                tags: ["liveStreamTwitch"],
            }),
        ]);

        const seasonEvents: EventAttributes[] = seasons.map((season) => ({
            uid: `${season._id}@arpg-timeline.com`,
            title: `${season.gameName} | ${season.name} launch`,
            description: `Visit https://www.arpg-timeline.com for more information.`,
            start: dateToDateArray(season.startDate),
            end: getEndDateArray(season.startDate),
            startInputType: "utc",
            startOutputType: "utc",
            endInputType: "utc",
            endOutputType: "utc",
            url: "https://www.arpg-timeline.com",
            calName: "arpg-timeline.com",
        }));

        const streamEvents: EventAttributes[] = streams.map((stream) => ({
            uid: `${stream._id}@arpg-timeline.com`,
            title: `${stream.gameName} | ${stream.name} | on Twitch`,
            description: `Visit https://www.arpg-timeline.com for more information.`,
            start: dateToDateArray(stream.date),
            end: getEndDateArray(stream.date),
            startInputType: "utc",
            startOutputType: "utc",
            endInputType: "utc",
            endOutputType: "utc",
            url: "https://www.arpg-timeline.com",
            calName: "arpg-timeline.com",
        }));

        const events = [...seasonEvents, ...streamEvents];

        const { error, value } = createEvents(events);

        if (error || !value) {
            console.error("Error creating ICS events:", error);
            return NextResponse.json({ error: "Failed to generate calendar" }, { status: 500 });
        }

        return new NextResponse(value, {
            status: 200,
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": 'attachment; filename="arpg-timeline.ics"',
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("Error fetching calendar data:", error);
        return NextResponse.json({ error: "Failed to fetch calendar data" }, { status: 500 });
    }
}

export const revalidate = 3600;
