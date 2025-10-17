"use client";

import Autoplay from "embla-carousel-autoplay";
import { Twitch } from "lucide-react";
import { useMemo } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import { StreamCard } from "@/components/StreamCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { useGameFilterContext, useTimeBasedKey } from "@/contexts/GameFilterContext";
import { isStreamSoon } from "@/lib/cms/isStreamSoon";
import { parseGameStreamsFromSanity } from "@/lib/cms/parseGameStreamsFromSanity";
import { SanityGame } from "@/lib/cms/queries/indexQuery";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/ui/Carousel";

import ClientOnlyVisibleWrapper from "./ClientOnlyVisibleWrapper";

export const TopCarousel = ({ games }: { games: SanityGame[] }) => {
    const nextDate = useMemo(
        () =>
            games
                .map((g) => g.latestLiveStream)
                .filter((s) => s)
                .map((s) => s!.date)
                .filter(
                    (d) =>
                        !!d && new Date(d).getTime() >= new Date().getTime() - 2 * 60 * 60 * 1000,
                )
                .sort((a, b) => new Date(a!).getTime() - new Date(b!).getTime())[0],
        [games],
    );

    const key = useTimeBasedKey(nextDate ? new Date(nextDate) : new Date());

    const parsedStreams = parseGameStreamsFromSanity({
        games,
    });
    const { filteredGames } = useGameFilterContext();

    const filteredStreams = useMemo(() => {
        return parsedStreams
            .map((s) => ({ ...s, isLiveSoon: isStreamSoon(s.date) }))
            .filter(
                (s) =>
                    filteredGames.find((g) => g.slug === s.gameSlug) &&
                    s.date &&
                    (s.isLiveSoon ||
                        (s?.date && new Date(s.date).getTime() > Date.now() - 2 * 60 * 60 * 1000)),
            );
    }, [filteredGames, parsedStreams]);

    return (
        <ClientOnlyVisibleWrapper key={key}>
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
        </ClientOnlyVisibleWrapper>
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
