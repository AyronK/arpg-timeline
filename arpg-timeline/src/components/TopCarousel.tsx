"use client";

import Autoplay from "embla-carousel-autoplay";
import { Twitch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import { StreamCard } from "@/components/StreamCard";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { useGameFilterContext, useTimeBasedKey } from "@/contexts/GameFilterContext";
import { isStreamSoon } from "@/lib/cms/isStreamSoon";
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
                                        delay: 7_000,
                                        stopOnMouseEnter: true,
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
                                            className={"h-28 cursor-all-scroll pr-4 pl-8"}
                                        >
                                            <div className="relative pt-3">
                                                <Twitch className="absolute top-4 right-2 z-10 mt-auto h-4 w-4 translate-x-1/2 -translate-y-1/2 fill-white stroke-[#6441a5] motion-safe:animate-bounce" />
                                                <StreamCard stream={s} priority={idx === 0} />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                    <CarouselItem
                                        className={
                                            "flex h-28 cursor-all-scroll items-center justify-center pr-4 pl-8"
                                        }
                                    >
                                        <Kicker />
                                    </CarouselItem>
                                    <CarouselItem
                                        className={"h-28 cursor-all-scroll pt-3 pr-4 pl-8"}
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

const PatreonFunding = () => (
    <Link
        href={process.env.NEXT_PUBLIC_PATREON_URL || "#"}
        rel="noopener"
        target="_blank"
        data-sa-click="patreon"
        className="text-card-foreground bg-card group relative flex h-full w-full items-center justify-between gap-4 overflow-hidden rounded-lg border-2 border-orange-500/30 p-4 transition-all hover:border-orange-500/50 hover:shadow-md md:p-6"
    >
        <div className="flex flex-1 items-center gap-3">
            <div className="bg-muted/50 grid h-10 w-10 shrink-0 place-content-center rounded-full md:h-12 md:w-12">
                <Image
                    src="/assets/patreon-logo.png"
                    className="m-auto h-5 w-5 opacity-70 md:h-6 md:w-6"
                    alt="Patreon logo"
                    width={24}
                    height={24}
                />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
                <h3 className="font-heading text-foreground text-sm font-medium md:text-base">
                    Support aRPG Timeline
                </h3>
                <p className="text-muted-foreground text-xs leading-tight md:text-sm">
                    Help us grow and keep the site private and ad-free!
                </p>
            </div>
        </div>
        <div className="border-border text-secondary-foreground flex shrink-0 items-center gap-1.5 rounded-md border bg-orange-500/30 px-3 py-1.5 transition-colors group-hover:bg-orange-500/50 md:px-4 md:py-2">
            <div className="font-heading text-xs leading-none font-medium md:text-sm">Support</div>
            <svg
                className="h-3 w-3 md:h-3.5 md:w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
            </svg>
        </div>
    </Link>
);
