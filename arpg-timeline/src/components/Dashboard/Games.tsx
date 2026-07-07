"use client";

import { Gamepad2, X } from "lucide-react";
import Image from "next/image";

import ErrorBoundary from "@/components/ErrorBoundary";
import { GameCard } from "@/components/GameCard/GameCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget/GameToSeasonWidget";
import { useDashboardImageLoadingOptimization } from "@/hooks/useDashboardImageLoadingOptimization";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { SanityImage } from "../SanityImage";
import { GracePeriodSeasonWidgetHoC } from "./GracePeriodSeasonWidgetHoC";

export const Games = ({
    games,
    statistics = {},
    onRemoveCustomEvent,
}: {
    games: Game[];
    statistics?: Record<string, GameStatistics>;
    onRemoveCustomEvent?: (id: string) => void;
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
                        "2xl:order-first": idx <= 3,
                        "4xl:order-first": idx <= 4,
                    })}
                >
                    <ErrorBoundary fallback={<WidgetDiedFallback />}>
                        <GameCard
                            name={game.name}
                            gameLogo={
                                game.isCustomEvent ? (
                                    game.customEventImageUrl ? (
                                        <Image
                                            src={game.customEventImageUrl}
                                            alt={`${game.name} logo`}
                                            className="my-auto"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                                objectPosition: "center",
                                            }}
                                            width={256}
                                            height={256}
                                        />
                                    ) : (
                                        <div className="text-muted-foreground my-auto flex flex-col items-center gap-1.5">
                                            <Gamepad2 className="h-8 w-8" />
                                        </div>
                                    )
                                ) : (
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
                                )
                            }
                            slug={game.slug}
                            shortName={game.shortName!}
                            url={game.url!}
                            official={game.isOfficial}
                            stats={statistics[game.slug]}
                            noMenu={game.isCustomEvent}
                        >
                            {game.isCustomEvent ? (
                                <>
                                    <GameToSeasonWidget game={game} selector="next" />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground mt-auto self-end gap-1.5"
                                        onClick={() =>
                                            onRemoveCustomEvent?.(
                                                game.slug.replace(/^custom-/, ""),
                                            )
                                        }
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Remove
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <GameToSeasonWidget game={game} selector="current" />
                                    <GracePeriodSeasonWidgetHoC game={game} />
                                </>
                            )}
                        </GameCard>
                    </ErrorBoundary>
                </div>
            ))}
        </>
    );
};
