"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { GameCard } from "@/components/GameCard/GameCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget/GameToSeasonWidget";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";

import { SanityImage } from "../SanityImage";
import { GracePeriodSeasonWidgetHoC } from "./GracePeriodSeasonWidgetHoC";

export const Games = ({
    games,
    statistics = {},
}: {
    games: Game[];
    statistics?: Record<string, GameStatistics>;
}) => {
    return (
        <>
            {games.map((game, idx) => (
                <div key={game.slug} className={gridOrderClass(idx)}>
                    <GameTile
                        game={game}
                        statistics={statistics}
                        loadEager={idx < EAGER_LOGO_COUNT}
                        preload={idx < PRELOAD_LOGO_COUNT}
                    />
                </div>
            ))}
        </>
    );
};

// Viewport-independent so server and client render the same attributes.
const EAGER_LOGO_COUNT = 10;
const PRELOAD_LOGO_COUNT = 2;

const gridOrderClass = (idx: number) =>
    cn("order-4 flex", {
        "order-first": idx <= 1,
        "xl:order-first": idx <= 2,
        "2xl:order-first": idx <= 3,
        "4xl:order-first": idx <= 4,
    });

const GameTile = ({
    game,
    statistics = {},
    loadEager,
    preload,
}: {
    game: Game;
    statistics?: Record<string, GameStatistics>;
    loadEager: boolean;
    preload: boolean;
}) => (
    <ErrorBoundary fallback={<WidgetDiedFallback />}>
        <GameCard
            name={game.name}
            gameLogo={
                <SanityImage
                    loading={loadEager ? "eager" : "lazy"}
                    preload={preload}
                    src={game.nextSeason?.logo ?? game.currentSeason?.logo ?? game.logo!}
                    alt={`${game.name} logo`}
                    className="my-auto"
                    width={256}
                    height={256}
                    objectFit="contain"
                />
            }
            slug={game.slug}
            shortName={game.shortName!}
            url={game.url!}
            buildsUrl={game.buildsUrl}
            guidesUrl={game.guidesUrl}
            nextSeasonStartDate={game.nextSeason?.start?.startDate}
            nextSeasonConfirmed={game.nextSeason?.start?.confirmed}
            currentSeasonStartDate={game.currentSeason?.start?.startDate}
            currentSeasonEndDate={game.currentSeason?.end?.endDate}
            official={game.isOfficial}
            stats={statistics[game.slug]}
        >
            <GameToSeasonWidget game={game} selector="current" />
            <GracePeriodSeasonWidgetHoC game={game} />
        </GameCard>
    </ErrorBoundary>
);
