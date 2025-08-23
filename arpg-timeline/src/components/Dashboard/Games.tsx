"use client";

import { Twitch } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { GameCard } from "@/components/GameCard/GameCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget/GameToSeasonWidget";
import { useScheduledRefresh } from "@/hooks/useScheduledRefresh";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { inGracePeriod } from "@/lib/games/sortBySeasons";
import { cn } from "@/lib/utils";
import { addUTMParameters } from "@/lib/utm";
import { Button } from "@/ui/Button";

import { MaybeLinkWrapper } from "../MaybeLinkWrapper";
import { SanityImage } from "../SanityImage";

export const getNextSeasonDate = (games: Game[]): Date => {
    const futureDates = games
        .flatMap((g) => [
            g.currentSeason?.start?.startDate,
            g.currentSeason?.end?.endDate,
            g.nextSeason?.start?.startDate,
            g.nextSeason?.end?.endDate,
        ])
        .filter((d) => d && new Date(d) > new Date())
        .map((d) => new Date(d!));
    return futureDates.length
        ? new Date(Math.min(...futureDates.map((d) => d.getTime())))
        : new Date();
};

const RefreshLoader = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }

                const remaining = 100 - prev;
                const slowdownFactor = Math.pow(remaining / 100, 2);
                const maxIncrement = 50 * slowdownFactor;

                return prev + Math.random() * Math.max(maxIncrement, 0.1);
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed top-0 left-0 z-[1000] h-[1px] w-screen">
            <div
                className={`h-full w-full bg-blue-500 transition-all duration-300 ease-out`}
                style={{
                    width: `${Math.min(progress, 100)}%`,
                }}
            />
        </div>
    );
};

export const useRefreshLoader = () => {
    const [showLoader, setShowLoader] = useState(false);

    return {
        showLoader,
        showRefreshLoader: () => setShowLoader(true),
        hideRefreshLoader: () => setShowLoader(false),
    };
};

export const Games = ({
    games,
    statistics = {},
}: {
    games: Game[];
    statistics?: Record<string, GameStatistics>;
}) => {
    const nextRefreshDate = useMemo(() => {
        return getNextSeasonDate(games);
    }, [games]);
    const { showLoader, showRefreshLoader, hideRefreshLoader } = useRefreshLoader();

    useScheduledRefresh({
        targetDate: nextRefreshDate,
        onBeforeRefresh: showRefreshLoader,
        onRefresh: hideRefreshLoader,
    });

    return (
        <>
            {showLoader && <RefreshLoader />}
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
                                    loading="lazy"
                                    src={game.logo!}
                                    alt={`${game.name} logo`}
                                    className="my-auto"
                                    width={160}
                                    height={140}
                                    objectFit="contain"
                                />
                            }
                            slug={game.slug}
                            shortName={game.shortName!}
                            url={game.url!}
                            official={game.official}
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
                                                        href={`https://www.twitch.tv/directory/category/${game.twitchCategory}`}
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
