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
}: {
    games: Game[];
    statistics?: Record<string, GameStatistics>;
}) => {
    const { shouldLoadImage } = useDashboardImageLoadingOptimization();

    return (
        <>
            {games.map((game, idx) => (
                <div
                    key={game.slug}
                    className={cn("order-4 flex", {
                        "order-first": idx <= 1,
                        "xl:order-first": idx <= 2,
                        "3xl:order-first": idx <= 3,
                        "4xl:order-first": idx <= 4,
                    })}
                >
                    <ErrorBoundary fallback={<WidgetDiedFallback />}>
                        <GameCard
                            name={game.name}
                            gameLogo={
                                <SanityImage
                                    loading={shouldLoadImage(idx) ? "eager" : "lazy"}
                                    priority={shouldLoadImage(idx)}
                                    src={
                                        game.nextSeason?.logo ??
                                        game.currentSeason?.logo ??
                                        game.logo!
                                    }
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
                            official={!game.categories?.includes("community")}
                            stats={statistics[game.slug]}
                        >
                            <GameToSeasonWidget game={game} selector="current" />
                            <GracePeriodSeasonWidgetHoC game={game} />
                        </GameCard>
                    </ErrorBoundary>
                </div>
            ))}
        </>
    );
};
