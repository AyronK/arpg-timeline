"use client";

import Autoplay from "embla-carousel-autoplay";
import { Twitch } from "lucide-react";
import { useMemo } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import { StreamCard } from "@/components/StreamCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { useGameFilters } from "@/hooks/useGameFilters";
import { Game, GameStream } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { isStreamSoon } from "@/lib/cms/isStreamSoon";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/ui/Carousel";

export const TopCarousel = ({
    games,
    streams,
    category = "featured",
}: {
    games: Game[];
    streams: GameStream[];
    category?: GameFilterCategory;
}) => {
    const { filteredGames } = useGameFilters(games, category);

    const filteredStreams = useMemo(() => {
        return streams
            .map((s) => ({ ...s, isLiveSoon: isStreamSoon(s.date) }))
            .filter(
                (s) =>
                    filteredGames.find((g) => g.slug === s.gameSlug) &&
                    s.date &&
                    (s.isLiveSoon ||
                        (s?.date && new Date(s.date).getTime() > Date.now() - 2 * 60 * 60 * 1000)),
            );
    }, [filteredGames, streams]);

    return (
        <div className="flex justify-center">
            <div className="relative mx-auto max-w-screen flex-1 lg:max-w-3xl">
                <h2 className="hidden">Streams</h2>
                <ErrorBoundary fallback={<WidgetDiedFallback />}>
                    <div className="mx-auto max-w-screen lg:max-w-3xl">
                        <Carousel
                            plugins={[
                                Autoplay({
                                    delay: 10_000,
                                    stopOnMouseEnter: true,
                                }),
                            ]}
                            className="w-full max-w-screen select-none lg:max-w-3xl"
                            opts={{
                                loop: true,
                                active: filteredStreams.length > 0,
                            }}
                        >
                            <CarouselContent>
                                {filteredStreams.map((s, idx) => (
                                    <CarouselItem
                                        key={s.slug}
                                        className={cn("h-28 pr-4 pl-8", {
                                            "cursor-all-scroll": filteredStreams.length > 0,
                                        })}
                                    >
                                        <div className="relative pt-3">
                                            <Twitch className="absolute top-4 right-2 z-10 mt-auto h-4 w-4 translate-x-1/2 -translate-y-1/2 fill-white stroke-[#6441a5] motion-safe:animate-bounce" />
                                            <StreamCard stream={s} priority={idx === 0} />
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

export const CarouselFallback = () => (
    <>
        <div className="sr-only">
            <Kicker />
        </div>
    </>
);

const Kicker = () => (
    <p className="font-heading flex-1 py-2 text-center align-middle text-sm text-balance select-none md:text-xl">
        Stay ahead in your favorite ARPGs with the season tracker.
        <br />
        Never miss a season start or end again!
    </p>
);
