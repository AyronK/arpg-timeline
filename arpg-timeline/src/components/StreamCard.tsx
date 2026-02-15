"use client";
import { TimerReset, Twitch } from "lucide-react";
import { useEffect, useState } from "react";

import { CalendarMenu } from "@/components/CalendarMenu";
import { Countdown } from "@/components/Countdown";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import LocalDate from "@/components/LocalDate";
import { ShareMenu } from "@/components/ShareMenu";
import { GameStream } from "@/lib/cms/games.types";
import { sa_event } from "@/lib/sa_event";
import { addUTMParameters } from "@/lib/utm";
import { Button } from "@/ui/Button";

import ClientOnlyVisibleWrapper from "./ClientOnlyVisibleWrapper";
import { SanityImage } from "./SanityImage";

const StreamHeader = ({
    gameName,
    name,
    date,
}: {
    name: string;
    date: string;
    gameName: string;
}) => {
    const [isUpcoming, setIsUpcoming] = useState(false);

    useEffect(() => {
        const checkIfUpcoming = () => {
            setIsUpcoming(new Date(date).getTime() > Date.now());
        };
        checkIfUpcoming();
    }, [date]);

    return (
        <div className="flex flex-row justify-between align-bottom">
            <h3 className="font-heading mt-auto line-clamp-1 text-xs text-nowrap text-ellipsis max-md:max-w-[25ch]">
                <span className="max-md:sr-only">{gameName} - </span>
                {name}
            </h3>
            <ClientOnlyVisibleWrapper>
                {isUpcoming && (
                    <IconLabel icon={TimerReset} className="text-xs font-semibold lg:text-sm">
                        <LocalDate longDate utcDate={date} />
                    </IconLabel>
                )}
            </ClientOnlyVisibleWrapper>
        </div>
    );
};

const WatchNowAction = ({
    twitchChannel,
    gameSlug,
}: {
    twitchChannel: string;
    gameSlug: string;
}) => {
    const addUTM = addUTMParameters({
        utm_source: "arpg-timeline",
        utm_medium: "link",
        utm_campaign: "twitch-channel",
        utm_content: gameSlug,
    });

    return (
        <FramedAction
            appendClassName="!bg-[#6441a5]"
            append={
                twitchChannel && (
                    <Button
                        asChild
                        size="icon"
                        className="mt-auto ml-auto !rounded-l-none !bg-[#6441a5]"
                        variant="destructive"
                    >
                        <a
                            target="_blank"
                            rel="noopener"
                            onClick={() => sa_event(`${gameSlug}-twitch-channel-click`)}
                            href={addUTM(`https://www.twitch.tv/${twitchChannel}`)}
                        >
                            <Twitch className="h-4 w-4" />
                        </a>
                    </Button>
                )
            }
        >
            <span className="my-auto">Watch now!</span>
        </FramedAction>
    );
};

const CountdownAction = ({ stream }: { stream: GameStream }) => {
    const addUTM = addUTMParameters({
        utm_source: "arpg-timeline",
    });

    return (
        <FramedAction
            prependClassName="!rounded-r-none"
            prepend={
                <ShareMenu
                    startDate={stream.date ?? ""}
                    title={`Hey, **${stream.gameName} ${stream.name} stream** is soon live on Twitch${stream.twitchChannel ? ` at ${addUTM(`https://www.twitch.tv/${stream.twitchChannel}`)}` : ""}`}
                />
            }
            appendClassName="!rounded-l-none"
            append={
                <CalendarMenu
                    startDate={stream.date ?? ""}
                    title={`${stream.gameName} stream on Twitch`}
                    gameSlug={stream.gameSlug}
                    gameName={stream.gameName}
                />
            }
        >
            <Countdown date={new Date(stream.date ?? "")} />
        </FramedAction>
    );
};

export const StreamCard = ({ stream, priority }: { stream: GameStream; priority: boolean }) => {
    const [isLiveSoon, setIsLiveSoon] = useState(false);

    useEffect(() => {
        const checkIsLiveSoon = () => {
            const date = stream.date;
            if (!date) {
                setIsLiveSoon(false);
                return;
            }
            const now = Date.now();
            const streamTime = new Date(date).getTime();
            const isStartingSoon = now < streamTime && streamTime - now <= 30 * 60 * 1000;
            const hasStarted = now >= streamTime;
            setIsLiveSoon(isStartingSoon || hasStarted);
        };
        checkIsLiveSoon();
        const interval = setInterval(checkIsLiveSoon, 10_000);
        return () => clearInterval(interval);
    }, [stream.date]);

    return (
        <section
            className="text-card-foreground bg-card relative flex flex-row gap-3 overflow-hidden rounded-lg border-2 border-[#6441a5]/40 p-4 md:gap-4"
            key={stream.slug}
        >
            <div className="flex items-center justify-center">
                <div className="xs:w-8 xs:min-w-8 sm:h-12 sm:w-12 sm:min-w-12 lg:h-16 lg:w-16">
                    <SanityImage
                        priority={priority}
                        loading={priority ? "eager" : "lazy"}
                        src={stream.gameLogo!}
                        alt={`${stream.gameName} logo`}
                        className="my-auto"
                        width={64}
                        height={64}
                        objectFit="contain"
                    />
                </div>
            </div>
            <div className="flex w-full flex-1 flex-col gap-1">
                <StreamHeader
                    gameName={stream.gameName}
                    name={stream.name}
                    date={stream.date ?? ""}
                />
                <ClientOnlyVisibleWrapper>
                    <div className="bg-card">
                        {isLiveSoon ? (
                            <WatchNowAction
                                twitchChannel={stream.twitchChannel}
                                gameSlug={stream.gameSlug}
                            />
                        ) : (
                            <CountdownAction stream={stream} />
                        )}
                    </div>
                </ClientOnlyVisibleWrapper>
            </div>
        </section>
    );
};
