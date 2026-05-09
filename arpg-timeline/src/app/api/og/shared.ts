import { readFileSync } from "fs";
import { join } from "path";

import { sanityClient } from "@/lib/sanity/sanityClient";

const ogGameQuery = `*[_type == "game" && slug.current == $slug][0]{
  name,
  shortName,
  "logoUrl": logo.asset->url,
  "recentSeasons": *[_type == "season" && ^._id == game._ref] | order(start.startDate desc)[0..2]{
    name,
    "logoUrl": logo.asset->url,
    start {
      startDate,
      confirmed,
      timeUnknown
    }
  }
}`;

export interface OgGameData {
    name: string;
    shortName?: string;
    logoUrl?: string;
    seasonName?: string;
    seasonLogoUrl?: string;
    seasonStartDate?: string;
    seasonTimeUnknown?: boolean;
}

export async function fetchOgGameData(slug: string): Promise<OgGameData | null> {
    try {
        const result = await sanityClient.fetch(
            ogGameQuery,
            { slug },
            { next: { revalidate: 3600 } },
        );
        if (!result) return null;

        const now = Date.now();
        type RawSeason = {
            name: string;
            logoUrl?: string;
            start?: { startDate?: string; confirmed?: boolean; timeUnknown?: boolean };
        };
        const seasons: RawSeason[] = result.recentSeasons ?? [];

        const nextSeason = seasons.find(
            (s) =>
                s.start?.confirmed &&
                s.start.startDate &&
                new Date(s.start.startDate).getTime() > now,
        );
        const currentSeason = seasons.find(
            (s) => s.start?.startDate && new Date(s.start.startDate).getTime() <= now,
        );
        const season = nextSeason ?? currentSeason ?? seasons[0];

        return {
            name: result.name,
            shortName: result.shortName ?? undefined,
            logoUrl: result.logoUrl ?? undefined,
            seasonName: season?.name ?? undefined,
            seasonLogoUrl: season?.logoUrl ?? undefined,
            seasonStartDate: nextSeason?.start?.startDate ?? undefined,
            seasonTimeUnknown: nextSeason?.start?.timeUnknown ?? undefined,
        };
    } catch {
        return null;
    }
}

export function formatSeasonDate(startDate: string, timeUnknown?: boolean): string {
    const date = new Date(startDate);
    const dateStr = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
    if (timeUnknown) return dateStr;
    const timeStr = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
    });
    return `${dateStr} at ${timeStr} UTC`;
}

const ogSeasonQuery = `*[_type == "season" && _id == $id][0]{
  name,
  "logoUrl": logo.asset->url,
  start {
    startDate,
    confirmed,
    timeUnknown
  },
  "game": game->{
    name,
    "logoUrl": logo.asset->url
  }
}`;

export interface OgSeasonData {
    seasonName: string;
    seasonLogoUrl?: string;
    seasonStartDate?: string;
    seasonTimeUnknown?: boolean;
    gameName: string;
    gameLogoUrl?: string;
}

export async function fetchOgSeasonData(id: string): Promise<OgSeasonData | null> {
    try {
        const result = await sanityClient.fetch(
            ogSeasonQuery,
            { id },
            { next: { revalidate: 3600 } },
        );
        if (!result?.game) return null;
        return {
            seasonName: result.name,
            seasonLogoUrl: result.logoUrl ?? undefined,
            seasonStartDate: result.start?.startDate ?? undefined,
            seasonTimeUnknown: result.start?.timeUnknown ?? undefined,
            gameName: result.game.name,
            gameLogoUrl: result.game.logoUrl ?? undefined,
        };
    } catch {
        return null;
    }
}

export function getSiteLogoBase64(): string {
    try {
        const buffer = readFileSync(join(process.cwd(), "public", "assets", "logo.png"));
        return `data:image/png;base64,${buffer.toString("base64")}`;
    } catch {
        return "";
    }
}

export async function loadCinzelFont(weight: 400 | 700 = 700): Promise<ArrayBuffer | null> {
    try {
        const css = await fetch(`https://fonts.googleapis.com/css2?family=Cinzel:wght@${weight}`, {
            headers: { "User-Agent": "Mozilla/5.0" },
            next: { revalidate: 86400 },
        }).then((r) => r.text());
        const url = css.match(/src: url\((.+?)\) format/)?.[1];
        if (!url) return null;
        return fetch(url, { next: { revalidate: 86400 } }).then((r) => r.arrayBuffer());
    } catch {
        return null;
    }
}
