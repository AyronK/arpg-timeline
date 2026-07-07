import { getIgdbAccessToken } from "./getIgdbAccessToken";
import { getIgdbImageUrl } from "./getIgdbImageUrl";

export interface UpcomingGame {
    id: number;
    name: string;
    date: string;
    imageUrl: string | null;
}

interface IgdbReleaseDate {
    id: number;
    date: number;
    game: {
        id: number;
        name: string;
        cover?: {
            image_id: string;
        };
    };
}

// PC (Microsoft Windows)
const PLATFORM_ID = 6;
const RESULT_LIMIT = 10;

const escapeQueryValue = (value: string): string =>
    value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

export async function searchUpcomingGames(query: string): Promise<UpcomingGame[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const clientId = process.env.IGDB_CLIENT_ID;
    const accessToken = await getIgdbAccessToken();

    if (!clientId || !accessToken) {
        return [];
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    const body = `fields game.name, game.cover.image_id, date;
where game.name ~ "${escapeQueryValue(trimmed)}"* & date > ${nowSeconds} & platform = ${PLATFORM_ID};
sort date asc;
limit ${RESULT_LIMIT};`;

    try {
        const response = await fetch("https://api.igdb.com/v4/release_dates", {
            method: "POST",
            headers: {
                "Client-ID": clientId,
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "text/plain",
            },
            body,
        });

        if (!response.ok) {
            console.error(`Failed to search IGDB release dates: ${response.status}`);
            return [];
        }

        const releaseDates: IgdbReleaseDate[] = await response.json();

        const seenGameIds = new Set<number>();
        const games: UpcomingGame[] = [];

        for (const releaseDate of releaseDates) {
            if (!releaseDate.game || seenGameIds.has(releaseDate.game.id)) continue;
            seenGameIds.add(releaseDate.game.id);
            games.push({
                id: releaseDate.game.id,
                name: releaseDate.game.name,
                date: new Date(releaseDate.date * 1000).toISOString().slice(0, 10),
                imageUrl: releaseDate.game.cover
                    ? getIgdbImageUrl(releaseDate.game.cover.image_id, "t_cover_big")
                    : null,
            });
        }

        return games;
    } catch (error) {
        console.error("Error searching IGDB release dates:", error);
        return [];
    }
}
