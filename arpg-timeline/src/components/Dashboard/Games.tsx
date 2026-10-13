"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { GameCard } from "@/components/GameCard/GameCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget/GameToSeasonWidget";
import { useDashboardImageLoadingOptimization } from "@/hooks/useDashboardImageLoadingOptimization";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";

import { SanityImage } from "../SanityImage";
import { GracePeriodSeasonWidgetHoC } from "./GracePeriodSeasonWidgetHoC";

export const Games = ({
    games,
    statistics = {},
    peekedSlugs = [],
}: {
    games: Game[];
    statistics?: Record<string, GameStatistics>;
    peekedSlugs?: string[];
}) => {
    const { shouldLoadImage } = useDashboardImageLoadingOptimization();

    return (
        <>
            {games.map((game, idx) => {
                const isPeeked = peekedSlugs.includes(game.slug);
                return (
                    <div
                        key={game.slug}
                        className={cn(gridOrderClass(idx), { "relative opacity-80": isPeeked })}
                    >
                        {isPeeked && <PeekLabel />}
                        <GameTile
                            game={game}
                            statistics={statistics}
                            loadEager={shouldLoadImage(idx)}
                        />
                    </div>
                );
            })}
        </>
    );
};

const PeekLabel = () => (
    <span className="bg-background/90 text-muted-foreground absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-full border px-2 py-0.5 text-[10px] tracking-wide whitespace-nowrap uppercase">
        Hidden by filters · until reload
    </span>
);

export const gridOrderClass = (idx: number) =>
    cn("order-4 flex", {
        "order-first": idx <= 1,
        "xl:order-first": idx <= 2,
        "2xl:order-first": idx <= 3,
        "4xl:order-first": idx <= 4,
    });

export const GameTile = ({
    game,
    statistics = {},
    loadEager,
}: {
    game: Game;
    statistics?: Record<string, GameStatistics>;
    loadEager: boolean;
}) => (
    <ErrorBoundary fallback={<WidgetDiedFallback />}>
        <GameCard
            name={game.name}
            gameLogo={
                <SanityImage
                    loading={loadEager ? "eager" : "lazy"}
                    priority={loadEager}
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
