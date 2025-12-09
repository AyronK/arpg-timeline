import { createEvents, DateArray, EventAttributes } from "ics";
import { NextResponse } from "next/server";

import { sanityFetch } from "@/lib/sanity/sanityClient";
import { addUTMParameters } from "@/lib/utm";

interface CalendarSeason {
    _id: string;
    name: string;
    gameName: string;
    startDate: string;
    url: string | null;
    patchNotesUrl: string | null;
}

interface CalendarStream {
    _id: string;
    name: string;
    gameName: string;
    date: string;
    twitchChannel: string | null;
}

const seasonsQuery = `*[_type == "season" && start.confirmed == true && start.startDate > now()]{
    _id,
    name,
    "gameName": game->name,
    "startDate": start.startDate,
    url,
    patchNotesUrl
} | order(start.startDate asc)`;

const streamsQuery = `*[_type == "liveStreamTwitch" && date > now()]{
    _id,
    name,
    "gameName": game->name,
    date,
    "twitchChannel": *[_type == "liveStreamPlatformTwitch" && game._ref == ^.game._ref][0].channel
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

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_medium: "calendar",
});

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

        const seasonEvents: EventAttributes[] = seasons.map((season) => {
            const descriptionParts: string[] = [];
            if (season.url) {
                descriptionParts.push(`Season page: ${addUTM(season.url)}`);
            }
            if (season.patchNotesUrl) {
                descriptionParts.push(`Patch notes: ${addUTM(season.patchNotesUrl)}`);
            }
            descriptionParts.push(
                `Visit https://www.arpg-timeline.com?utm_source=calendar for more information.`,
            );

            return {
                uid: `${season._id}@arpg-timeline.com`,
                title: `${season.gameName} | ${season.name} launch`,
                description: descriptionParts.join("\n\n"),
                start: dateToDateArray(season.startDate),
                end: getEndDateArray(season.startDate),
                startInputType: "utc",
                startOutputType: "utc",
                endInputType: "utc",
                endOutputType: "utc",
                url: "https://www.arpg-timeline.com?utm_source=calendar",
                calName: "arpg-timeline.com",
                busyStatus: "FREE",
                alarms: [{ action: "display", trigger: { hours: 1, before: true } }],
            } satisfies EventAttributes;
        });

        const streamEvents: EventAttributes[] = streams.map((stream) => {
            const twitchUrl = stream.twitchChannel
                ? `https://www.twitch.tv/${stream.twitchChannel}`
                : null;
            const description = twitchUrl
                ? `Watch on Twitch: ${twitchUrl}\n\nVisit https://www.arpg-timeline.com?utm_source=calendar for more information.`
                : `Visit https://www.arpg-timeline.com?utm_source=calendar for more information.`;

            return {
                uid: `${stream._id}@arpg-timeline.com`,
                title: `${stream.gameName} | ${stream.name} | on Twitch`,
                description,
                start: dateToDateArray(stream.date),
                end: getEndDateArray(stream.date),
                startInputType: "utc",
                startOutputType: "utc",
                endInputType: "utc",
                endOutputType: "utc",
                url: "https://www.arpg-timeline.com?utm_source=calendar",
                calName: "arpg-timeline.com",
                busyStatus: "FREE",
                alarms: [{ action: "display", trigger: { hours: 1, before: true } }],
            } satisfies EventAttributes;
        });

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
