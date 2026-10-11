import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { gameDetailsQuery, GameDetailsQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

// Shared by the hub layout and tab pages; sanityFetch dedupes the request
export async function getGameDetails(gameSlug: string) {
    const data: GameDetailsQueryResult = await sanityFetch({
        query: gameDetailsQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "game"],
    });
    const game = parseGamesFromSanity(data).find((g) => g.slug === gameSlug) ?? null;
    const steamAppId = data.games.find((g) => g.slug === gameSlug)?.steam?.appId ?? null;

    return { data, game, steamAppId };
}
