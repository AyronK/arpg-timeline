"use client";

import Autoplay from "embla-carousel-autoplay";
import { Twitch } from "lucide-react";
import { memo, useMemo } from "react";

import { CalendarSubscriptionAlert } from "@/components/CalendarSubscriptionAlert";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PatreonFunding } from "@/components/PatreonFunding";
import { StreamCard } from "@/components/StreamCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { useGameFilterContext, useTimeBasedKey } from "@/contexts/GameFilterContext";
import { parseGameStreamsFromSanity } from "@/lib/cms/parseGameStreamsFromSanity";
import { SanityGame } from "@/lib/cms/queries/indexQuery";
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/ui/Carousel";

import { BuyMeACoffee } from "./BuyMeACoffee";
import ClientOnlyVisibleWrapper from "./ClientOnlyVisibleWrapper";

const StreamCarouselSlides = memo(function StreamCarouselSlides({
    streams,
}: {
    streams: ReturnType<typeof parseGameStreamsFromSanity>;
}) {
    return (
        <>
            {streams.map((s, idx) => (
                <CarouselItem
                    key={s.slug}
                    className="flex h-28 cursor-all-scroll items-center justify-center pr-4 pl-8"
                >
                    <div className="relative flex-1 pt-3">
                        <Twitch className="absolute top-4 right-2 z-10 mt-auto h-4 w-4 translate-x-1/2 -translate-y-1/2 fill-white stroke-[#6441a5] motion-safe:animate-bounce" />
                        <StreamCard stream={s} priority={idx === 0} />
                    </div>
                </CarouselItem>
            ))}
        </>
    );
});

const CtaCarouselSlides = memo(function CtaCarouselSlides() {
    return (
        <>
            <CarouselItem className="flex h-28 cursor-all-scroll items-center justify-center pt-3 pr-4 pl-8 [&>*]:h-full">
                <PatreonFunding />
            </CarouselItem>
            <CarouselItem className="flex h-28 cursor-all-scroll items-center justify-center pt-3 pr-4 pl-8 [&>*]:h-full">
                <BuyMeACoffee />
            </CarouselItem>
            <CarouselItem className="flex h-28 cursor-all-scroll items-center justify-center pt-3 pr-4 pl-8 [&>*]:h-full">
                <CalendarSubscriptionAlert />
            </CarouselItem>
        </>
    );
});

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

    const refreshTimestamp = useMemo(
        () => (nextDate ? new Date(nextDate).getTime() : 0),
        [nextDate],
    );
    const refreshKey = useTimeBasedKey(refreshTimestamp);

    const parsedStreams = useMemo(() => parseGameStreamsFromSanity({ games }), [games]);
    const { filteredGames } = useGameFilterContext();

    const filteredStreams = useMemo(() => {
        return parsedStreams.filter(
            (s) =>
                filteredGames.find((g) => g.slug === s.gameSlug) &&
                s.date &&
                new Date(s.date).getTime() > Date.now() - 2 * 60 * 60 * 1000,
        );
    }, [filteredGames, parsedStreams]);

    const slideCount = filteredStreams.length + 3;

    const carouselPlugins = useMemo(
        () => [
            Autoplay({
                delay: 5000,
                stopOnMouseEnter: true,
                playOnInit: true,
                stopOnFocusIn: false,
            }),
        ],
        [],
    );

    const carouselOpts = useMemo(
        () => ({
            loop: true,
            active: true,
        }),
        [],
    );

    return (
        <ClientOnlyVisibleWrapper key={refreshKey || undefined}>
            <div className="flex justify-center">
                <div className="relative mx-auto max-w-screen flex-1 lg:max-w-4xl">
                    <h2 className="hidden">Streams</h2>
                    <ErrorBoundary fallback={<WidgetDiedFallback />}>
                        <div className="mx-auto max-w-screen lg:max-w-4xl">
                            <Carousel
                                plugins={carouselPlugins}
                                className="w-full max-w-screen select-none lg:max-w-4xl"
                                opts={carouselOpts}
                            >
                                <CarouselContent>
                                    <StreamCarouselSlides streams={filteredStreams} />
                                    <CtaCarouselSlides />
                                </CarouselContent>
                                <CarouselDots className="py-2" slideCount={slideCount} />
                            </Carousel>
                        </div>
                    </ErrorBoundary>
                </div>
            </div>
        </ClientOnlyVisibleWrapper>
    );
};
