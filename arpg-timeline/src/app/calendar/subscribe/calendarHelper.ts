import { createEvents, DateArray, EventAttributes } from "ics";

import { sanityFetch } from "@/lib/sanity/sanityClient";
import { addUTMParameters } from "@/lib/utm";

export interface CalendarSeason {
    _id: string;
    name: string;
    gameName: string;
    gameSlug: string;
    startDate: string;
    url: string | null;
    patchNotesUrl: string | null;
}

export interface CalendarStream {
    _id: string;
    name: string;
    gameName: string;
    gameSlug: string;
    date: string;
    twitchChannel: string | null;
}

export interface CalendarGame {
    slug: string;
    name: string;
}

const seasonsQuery = `*[_type == "season" && start.confirmed == true && start.startDate > now()]{
    _id,
    name,
    "gameName": game->name,
    "gameSlug": game->slug.current,
    "startDate": start.startDate,
    url,
    patchNotesUrl
} | order(start.startDate asc)`;

const streamsQuery = `*[_type == "liveStreamTwitch" && date > now()]{
    _id,
    name,
    "gameName": game->name,
    "gameSlug": game->slug.current,
    date,
    "twitchChannel": *[_type == "liveStreamPlatformTwitch" && game._ref == ^.game._ref][0].channel
} | order(date asc)`;

const gamesQuery = `*[_type == "game"]{
    "slug": slug.current,
    name
} | order(name asc)`;

const gameBySlugQuery = `*[_type == "game" && slug.current == $slug][0]{
    "slug": slug.current,
    name
}`;

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

export async function fetchCalendarData(): Promise<{
    seasons: CalendarSeason[];
    streams: CalendarStream[];
}> {
    const [seasons, streams]: [CalendarSeason[], CalendarStream[]] = await Promise.all([
        sanityFetch({
            query: seasonsQuery,
            revalidate: false,
            tags: ["season"],
        }),
        sanityFetch({
            query: streamsQuery,
            revalidate: false,
            tags: ["liveStreamTwitch"],
        }),
    ]);

    return { seasons, streams };
}

export async function fetchAllGameSlugs(): Promise<CalendarGame[]> {
    return sanityFetch({
        query: gamesQuery,
        revalidate: false,
        tags: ["game"],
    });
}

export async function fetchGameBySlug(slug: string): Promise<CalendarGame | null> {
    return sanityFetch({
        query: gameBySlugQuery,
        params: { slug },
        revalidate: 24 * 60 * 60,
        tags: ["game"],
    });
}

export function createSeasonEvents(
    seasons: CalendarSeason[],
    gameName?: string,
): EventAttributes[] {
    const calName = gameName ? `arpg-timeline.com | ${gameName}` : "arpg-timeline.com";

    return seasons.map((season) => {
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
            calName,
            busyStatus: "FREE",
        } satisfies EventAttributes;
    });
}

export function createStreamEvents(
    streams: CalendarStream[],
    gameName?: string,
): EventAttributes[] {
    const calName = gameName ? `arpg-timeline.com | ${gameName}` : "arpg-timeline.com";

    return streams.map((stream) => {
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
            calName,
            busyStatus: "FREE",
        } satisfies EventAttributes;
    });
}

function buildEmptyIcs(calName: string): string {
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//arpg-timeline.com//aRPG Timeline//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${calName}
END:VCALENDAR`;
}

export function generateIcsResponse(
    events: EventAttributes[],
    gameName?: string,
): {
    error: string | null;
    value: string | null;
} {
    const calName = gameName ? `arpg-timeline.com | ${gameName}` : "arpg-timeline.com";

    if (events.length === 0) {
        return { error: null, value: buildEmptyIcs(calName) };
    }

    const { error, value } = createEvents(events);

    if (error || !value) {
        return { error: "Failed to generate calendar", value: null };
    }

    return { error: null, value };
}

export function buildIcsHeaders(filename: string = "arpg-timeline"): HeadersInit {
    return {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}.ics"`,
        "Cache-Control": "public, max-age=3600",
    };
}
