"use client";

import { Twitch } from "lucide-react";
import Link from "next/link";

import ErrorBoundary from "@/components/ErrorBoundary";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { GameCard } from "@/components/GameCard/GameCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget/GameToSeasonWidget";
import { useDashboardImageLoadingOptimization } from "@/hooks/useDashboardImageLoadingOptimization";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { inGracePeriod } from "@/lib/games/sortBySeasons";
import { cn } from "@/lib/utils";
import { addUTMParameters } from "@/lib/utm";
import { Button } from "@/ui/Button";

import { MaybeLinkWrapper } from "../MaybeLinkWrapper";
import { SanityImage } from "../SanityImage";

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
                                    quality={50}
                                    width={160}
                                    height={140}
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
                            {inGracePeriod(game.currentSeason?.start?.startDate) ? (
                                <div className="mt-auto flex flex-col gap-2">
                                    {game.currentSeason?.patchNotesUrl && (
                                        <MaybeLinkWrapper
                                            href={addUTMParameters({
                                                utm_source: "arpg-timeline",
                                                utm_term: "patch+notes",
                                                utm_content: "patch-notes-link",
                                            })(game.currentSeason.patchNotesUrl)}
                                            target="_blank"
                                            className="ml-auto text-sm text-nowrap hover:underline"
                                            data-sa-click={`${game.currentSeason.name}-patch-notes`}
                                        >
                                            Patch notes
                                        </MaybeLinkWrapper>
                                    )}
                                    <FramedAction
                                        appendClassName="!bg-[#6441a5]"
                                        append={
                                            game.twitchCategory && (
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    className="mt-auto ml-auto !rounded-l-none !bg-[#6441a5]"
                                                    variant="destructive"
                                                >
                                                    <Link
                                                        target="_blank"
                                                        rel="noopener"
                                                        data-sa-click={`${game.slug}-twitch`}
                                                        href={addUTMParameters({
                                                            utm_source: "arpg-timeline",
                                                            utm_medium: "link",
                                                            utm_campaign: "twitch-category",
                                                            utm_content: game.slug,
                                                        })(
                                                            `https://www.twitch.tv/directory/category/${game.twitchCategory}`,
                                                        )}
                                                    >
                                                        <Twitch className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            )
                                        }
                                    >
                                        {game.twitchCategory ? "Play and watch now!" : "Play now!"}
                                    </FramedAction>
                                </div>
                            ) : (
                                <GameToSeasonWidget game={game} selector="next" />
                            )}
                        </GameCard>
                    </ErrorBoundary>
                </div>
            ))}
        </>
    );
};
