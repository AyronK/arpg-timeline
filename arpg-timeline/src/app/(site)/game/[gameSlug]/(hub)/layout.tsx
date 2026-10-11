import { notFound } from "next/navigation";
import { ReactNode } from "react";

import { getGameArticlesPreview } from "@/lib/articles/getArticleListData";
import { getSteamCurrentPlayers } from "@/lib/steam/getMultipleSteamCurrentPlayers";

import { GameHubHeader } from "../components/hub/GameHubHeader";
import { getGameDetails } from "../gameData";
import { hasStatsTab } from "../hub";
import { countGameEntries, hasTimeline } from "./timeline/timeline";

const GameHubLayout = async ({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ gameSlug: string }>;
}) => {
    const { gameSlug } = await params;

    const { data, game, steamAppId: appId } = await getGameDetails(gameSlug);
    if (!game) notFound();

    const [steam, articles] = await Promise.all([
        appId ? getSteamCurrentPlayers(appId) : null,
        getGameArticlesPreview(gameSlug),
    ]);

    return (
        <>
            <GameHubHeader
                game={game}
                steam={steam && { appId: steam.appId, currentPlayers: steam.currentPlayers }}
                tabFlags={{
                    hasTimeline: hasTimeline(game, countGameEntries(data.seasons, gameSlug)),
                    hasGuides: articles.resources.length > 0,
                    hasStats: hasStatsTab(game, !!appId),
                }}
            />
            {children}
        </>
    );
};

export default GameHubLayout;
