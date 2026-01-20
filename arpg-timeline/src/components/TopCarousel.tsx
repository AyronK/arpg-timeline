"use client";

import Autoplay from "embla-carousel-autoplay";
import { Twitch } from "lucide-react";
import { useMemo } from "react";

import { CalendarSubscriptionAlert } from "@/components/CalendarSubscriptionAlert";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PatreonFunding } from "@/components/PatreonFunding";
import { StreamCard } from "@/components/StreamCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { useGameFilterContext, useTimeBasedKey } from "@/contexts/GameFilterContext";
import { parseGameStreamsFromSanity } from "@/lib/cms/parseGameStreamsFromSanity";
import { SanityGame } from "@/lib/cms/queries/indexQuery";
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
        return parsedStreams.filter(
            (s) =>
                filteredGames.find((g) => g.slug === s.gameSlug) &&
                s.date &&
                new Date(s.date).getTime() > Date.now() - 2 * 60 * 60 * 1000,
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
                                        delay: 7_500,
                                        stopOnMouseEnter: true,
                                        playOnInit: true,
                                        stopOnFocusIn: false,
                                    }),
                                ]}
                                className="w-full max-w-screen select-none lg:max-w-3xl"
                                opts={{
                                    loop: true,
                                    active: true,
                                }}
                            >
                                <CarouselContent>
                                    {filteredStreams.map((s, idx) => (
                                        <CarouselItem
                                            key={s.slug}
                                            className={
                                                "flex h-28 cursor-all-scroll items-center justify-center pr-4 pl-8"
                                            }
                                        >
                                            <div className="relative flex-1 pt-3">
                                                <Twitch className="absolute top-4 right-2 z-10 mt-auto h-4 w-4 translate-x-1/2 -translate-y-1/2 fill-white stroke-[#6441a5] motion-safe:animate-bounce" />
                                                <StreamCard stream={s} priority={idx === 0} />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                    <CarouselItem
                                        className={
                                            "flex h-28 cursor-all-scroll items-center justify-center pt-3 pr-4 pl-8"
                                        }
                                    >
                                        <CalendarSubscriptionAlert />
                                    </CarouselItem>
                                    <CarouselItem
                                        className={
                                            "flex h-28 cursor-all-scroll items-center justify-center pt-3 pr-4 pl-8"
                                        }
                                    >
                                        <PatreonFunding />
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
