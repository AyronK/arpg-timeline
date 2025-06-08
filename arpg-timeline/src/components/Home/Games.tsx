"use client";

import { Twitch } from "lucide-react";
import Link from "next/link";

import ErrorBoundary from "@/components/ErrorBoundary";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { GameCard } from "@/components/GameCard/GameCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget";
import { Game } from "@/lib/cms/games.types";
import { inGracePeriod } from "@/lib/games/sortBySeasons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { SanityImage } from "../SanityImage";

export const Games = ({ games }: { games: Game[] }) => {
    return (
        <>
            <h2 className="hidden">Seasons</h2>
            {games.map((game, idx) => (
                <div
                    key={game.slug}
                    className={cn("order-last flex", {
                        "order-first": idx <= 1,
                        "xl:order-first": idx <= 2,
                        "3xl:order-first": idx <= 3,
                        "4xl:order-first": idx <= 4,
                    })}
                >
                    <ErrorBoundary fallback={<WidgetDiedFallback />}>
                        <GameCard
                            name={game.name}
                            logo={
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
                        >
                            <GameToSeasonWidget game={game} selector="current" />
                            {inGracePeriod(game.currentSeason?.start?.startDate) ? (
                                <div className="mt-auto">
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
                                                        rel="noreferrer"
                                                        data-sa-click={`${game.slug}-twitch`}
                                                        href={`https://www.twitch.tv/directory/category/${game.twitchCategory}`}
                                                    >
                                                        <Twitch className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            )
                                        }
                                    >
                                        Play and watch now!
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
