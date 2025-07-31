"use client";

import Autoplay from "embla-carousel-autoplay";
import { Twitch } from "lucide-react";

import ErrorBoundary from "@/components/ErrorBoundary";
import { StreamCard } from "@/components/StreamCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { GameStream } from "@/lib/cms/games.types";
import { useFilteredGames } from "@/lib/config/filters/GameFiltersContext";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/ui/Carousel";

export const Streams = ({ streams }: { streams: GameStream[] }) => {
    const filteredGames = useFilteredGames();
    const filteredStreams = streams.filter((s) => filteredGames.find((g) => g.slug === s.gameSlug));

    return (
        filteredStreams?.length > 0 && (
            <div className={cn({ "flex justify-center": filteredStreams.length === 1 })}>
                <div
                    className={cn("relative max-w-full flex-1 md:max-w-3xl", {
                        "mx-auto": filteredStreams.length > 1,
                    })}
                >
                    <h2 className="hidden">Streams</h2>
                    <Twitch className="absolute top-0 right-0 z-10 mt-auto h-4 w-4 translate-x-1/2 -translate-y-1/2 fill-white stroke-[#6441a5] motion-safe:animate-bounce" />
                    <ErrorBoundary fallback={<WidgetDiedFallback />}>
                        <div className="mx-auto max-w-3xl">
                            <Carousel
                                plugins={[
                                    Autoplay({
                                        delay: 5_000,
                                        stopOnMouseEnter: true,
                                    }),
                                ]}
                                className="w-full max-w-3xl"
                                opts={{
                                    loop: true,
                                    active: filteredStreams.length > 1,
                                }}
                            >
                                <CarouselContent>
                                    {filteredStreams.map((s) => (
                                        <CarouselItem
                                            key={s.slug}
                                            className={cn({
                                                "cursor-all-scroll": filteredStreams.length > 1,
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
        )
    );
};

// TODO refactor
export const StreamsFallback = ({ streams }: { streams: GameStream[] }) => {
    return (
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
    );
};
