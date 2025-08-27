"use client";

import Autoplay from "embla-carousel-autoplay";
import { Twitch } from "lucide-react";

import ErrorBoundary from "@/components/ErrorBoundary";
import { StreamCard } from "@/components/StreamCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { useGameFilters } from "@/hooks/useGameFilters";
import { Game, GameStream } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/ui/Carousel";

export const Streams = ({ games, streams }: { games: Game[]; streams: GameStream[] }) => {
    const { filteredGames } = useGameFilters(games);
    const filteredStreams = streams.filter((s) => filteredGames.find((g) => g.slug === s.gameSlug));

    return (
        <div className="flex justify-center max-sm:-mx-4">
            <div className="relative mx-auto max-w-full flex-1 md:max-w-3xl">
                <h2 className="hidden">Streams</h2>

                <ErrorBoundary fallback={<WidgetDiedFallback />}>
                    <div className="mx-auto max-w-3xl">
                        <Carousel
                            plugins={[
                                Autoplay({
                                    delay: 5_000,
                                    stopOnMouseEnter: true,
                                }),
                            ]}
                            className="w-full max-w-3xl select-none"
                            opts={{
                                loop: true,
                                active: filteredStreams.length > 0,
                            }}
                        >
                            <CarouselContent>
                                {filteredStreams.map((s) => (
                                    <CarouselItem
                                        key={s.slug}
                                        className={cn("h-28 pr-4 pl-8", {
                                            "cursor-all-scroll": filteredStreams.length > 0,
                                        })}
                                    >
                                        <div className="relative pt-3">
                                            <Twitch className="absolute top-4 right-2 z-10 mt-auto h-4 w-4 translate-x-1/2 -translate-y-1/2 fill-white stroke-[#6441a5] motion-safe:animate-bounce" />
                                            <StreamCard stream={s} />
                                        </div>
                                    </CarouselItem>
                                ))}
                                <CarouselItem
                                    className={cn(
                                        "flex h-28 items-center justify-center pr-4 pl-8",
                                        {
                                            "cursor-all-scroll": filteredStreams.length > 0,
                                        },
                                    )}
                                >
                                    <Kicker />
                                </CarouselItem>
                            </CarouselContent>
                        </Carousel>
                    </div>
                </ErrorBoundary>
            </div>
        </div>
    );
};

// TODO refactor
export const StreamsFallback = ({ streams }: { streams: GameStream[] }) => {
    return (
        <>
            <Kicker />
            <div className="sr-only">
                {streams?.length > 0 && (
                    <div className={cn({ "flex justify-center": streams.length === 1 })}>
                        <div
                            className={cn("relative max-w-3xl flex-1", {
                                "mx-auto": streams.length > 1,
                            })}
                        >
                            <h2 className="hidden">Streams</h2>
                            <Twitch className="absolute top-0 right-0 z-10 mt-auto h-4 w-4 translate-x-1/2 -translate-y-1/2 fill-white stroke-[#6441a5] motion-safe:animate-bounce" />
                            <ErrorBoundary fallback={<WidgetDiedFallback />}>
                                <div className="mx-auto max-w-3xl">
                                    <Carousel
                                        plugins={[
                                            Autoplay({
                                                delay: 10_000,
                                                stopOnMouseEnter: true,
                                            }),
                                        ]}
                                        className="w-full max-w-3xl"
                                        opts={{
                                            loop: true,
                                            active: streams.length > 1,
                                        }}
                                    >
                                        <CarouselContent>
                                            {streams.map((s) => (
                                                <CarouselItem
                                                    key={s.slug}
                                                    className={cn({
                                                        "cursor-all-scroll": streams.length > 1,
                                                    })}
                                                >
                                                    <StreamCard stream={s} />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </ErrorBoundary>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

const Kicker = () => (
    <p className="font-heading flex-1 py-2 text-center align-middle text-sm select-none md:text-xl">
        Stay ahead in your favorite ARPGs with the season tracker.
        <br />
        Never miss a season start or end again!
    </p>
);
