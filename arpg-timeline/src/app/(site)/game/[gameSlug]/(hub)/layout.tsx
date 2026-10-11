import { notFound } from "next/navigation";
import { ReactNode } from "react";

import { getGameArticlesPreview } from "@/lib/articles/getArticleListData";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { gameDetailsQuery, GameDetailsQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { getSteamCurrentPlayers } from "@/lib/steam/getMultipleSteamCurrentPlayers";

import { GameHubHeader } from "../components/hub/GameHubHeader";

const GameHubLayout = async ({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ gameSlug: string }>;
}) => {
    const { gameSlug } = await params;

    const data: GameDetailsQueryResult = await sanityFetch({
        query: gameDetailsQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "game"],
    });

    const game = parseGamesFromSanity(data).find((g) => g.slug === gameSlug);
    if (!game) notFound();

    const appId = data.games.find((g) => g.slug === gameSlug)?.steam?.appId;
    const [steam, articles] = await Promise.all([
        appId ? getSteamCurrentPlayers(appId) : null,
        getGameArticlesPreview(gameSlug),
    ]);

    return (
        <>
            <GameHubHeader
                game={game}
                steam={steam && { appId: steam.appId, currentPlayers: steam.currentPlayers }}
                hasGuides={articles.resources.length > 0}
            />
            {children}
        </>
    );
};

export default GameHubLayout;
