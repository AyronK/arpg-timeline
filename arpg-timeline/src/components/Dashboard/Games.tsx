"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { GameCard } from "@/components/GameCard/GameCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget/GameToSeasonWidget";
import { useDashboardImageLoadingOptimization } from "@/hooks/useDashboardImageLoadingOptimization";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";

import { PROTON_INSERT_INDEX } from "./dashboardGridConfig";
import { ProtonAffiliateCard } from "./ProtonAffiliateCard";
import { SanityImage } from "../SanityImage";
import { GracePeriodSeasonWidgetHoC } from "./GracePeriodSeasonWidgetHoC";

export const Games = ({
    games,
    statistics = {},
    protonInsertIndex = PROTON_INSERT_INDEX,
}: {
    games: Game[];
    statistics?: Record<string, GameStatistics>;
    /** 0-based index in the games list where the Proton card is inserted. */
    protonInsertIndex?: number;
}) => {
    const { shouldLoadImage } = useDashboardImageLoadingOptimization();

    // TODO: not so sure about this, perhaps if we allow disabling ads in filters panel? Or perhaps a smaller ad in the timeline widget?
    const items: Array<{ type: "game"; game: Game; idx: number } | { type: "proton" }> = [];
    games.forEach((game, idx) => {
        if (idx === protonInsertIndex) {
            items.push({ type: "proton" });
        }
        items.push({ type: "game", game, idx });
    });
    if (games.length <= protonInsertIndex) {
        items.push({ type: "proton" });
    }

    return (
        <>
            {items.map((item, mergedIndex) =>
                item.type === "proton" ? (
                    <div
                        key="proton-affiliate"
                        className={cn("order-5 flex", {
                            "order-first": mergedIndex <= 1,
                            "xl:order-first": mergedIndex <= 2,
                            "3xl:order-first": mergedIndex <= 3,
                            "4xl:order-first": mergedIndex <= 4,
                        })}
                    >
                        <ProtonAffiliateCard />
                    </div>
                ) : (
                    <div
                        key={item.game.slug}
                        className={cn("order-5 flex", {
                            "order-first": mergedIndex <= 1,
                            "xl:order-first": mergedIndex <= 2,
                            "3xl:order-first": mergedIndex <= 3,
                            "4xl:order-first": mergedIndex <= 4,
                        })}
                    >
                        <ErrorBoundary fallback={<WidgetDiedFallback />}>
                            <GameCard
                                name={item.game.name}
                                gameLogo={
                                    <SanityImage
                                        loading={shouldLoadImage(item.idx) ? "eager" : "lazy"}
                                        priority={shouldLoadImage(item.idx)}
                                        src={
                                            item.game.nextSeason?.logo ??
                                            item.game.currentSeason?.logo ??
                                            item.game.logo!
                                        }
                                        alt={`${item.game.name} logo`}
                                        className="my-auto"
                                        width={256}
                                        height={256}
                                        objectFit="contain"
                                    />
                                }
                                slug={item.game.slug}
                                shortName={item.game.shortName!}
                                url={item.game.url!}
                                official={item.game.isOfficial}
                                stats={statistics[item.game.slug]}
                            >
                                <GameToSeasonWidget game={item.game} selector="current" />
                                <GracePeriodSeasonWidgetHoC game={item.game} />
                            </GameCard>
                        </ErrorBoundary>
                    </div>
                ),
            )}
        </>
    );
};
