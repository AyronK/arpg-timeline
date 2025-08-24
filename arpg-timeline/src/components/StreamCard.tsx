import { TimerReset, Twitch } from "lucide-react";

import { CalendarMenu } from "@/components/CalendarMenu";
import { Countdown } from "@/components/Countdown";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import LocalDate from "@/components/LocalDate";
import { ShareMenu } from "@/components/ShareMenu";
import { GameStream } from "@/lib/cms/games.types";
import { sa_event } from "@/lib/sa_event";
import { Button } from "@/ui/Button";
import { addUTMParameters } from "@/lib/utm";

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
}) => (
    <div className="flex flex-row justify-between align-bottom">
        <h3 className="font-heading mt-auto line-clamp-1 text-xs text-nowrap text-ellipsis">
            <span className="sr-only md:not-sr-only">{gameName} - </span>
            {name}
        </h3>
        <div className="hidden lg:block">
            <ClientOnlyVisibleWrapper>
                {Date.now() < new Date(date).getTime() && (
                    <IconLabel icon={TimerReset}>
                        <span className="font-semibold">
                            <LocalDate longDate utcDate={date} />
                        </span>
                    </IconLabel>
                )}
            </ClientOnlyVisibleWrapper>
        </div>
    </div>
);

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
            }
        >
            Watch now!
        </FramedAction>
    );
};

const CountdownAction = ({ stream }: { stream: GameStream }) => (
    <FramedAction
        prependClassName="!rounded-r-none"
        prepend={
            <ShareMenu
                startDate={stream.date ?? ""}
                title={`Hey, **${stream.gameName} ${stream.name} stream** is soon live on Twitch`}
            />
        }
        appendClassName="!rounded-l-none"
        append={
            <CalendarMenu
                startDate={stream.date ?? ""}
                title={`${stream.gameName} stream on Twitch`}
            />
        }
    >
        <Countdown date={new Date(stream.date ?? "")} />
    </FramedAction>
);

export const StreamCard = ({ stream }: { stream: GameStream }) => {
    const isLiveSoon = stream.date && Date.now() > new Date(stream.date).getTime() - 30 * 60 * 1000;

    return (
        <section
            className="text-card-foreground bg-card relative flex flex-row gap-3 rounded-lg border-2 border-[#6441a5]/40 p-4 md:gap-4"
            key={stream.slug}
        >
            <div className="flex h-14 w-14 md:h-16 md:w-16">
                <SanityImage
                    loading="lazy"
                    src={stream.gameLogo!}
                    alt={`${stream.gameName} logo`}
                    className="my-auto"
                    width={64}
                    height={64}
                    quality={50}
                    objectFit="contain"
                />
            </div>
            <div className="flex w-full flex-1 flex-col gap-1">
                <StreamHeader
                    gameName={stream.gameName}
                    name={stream.name}
                    date={stream.date ?? ""}
                />
                <ClientOnlyVisibleWrapper>
                    <div className="bg-card">
                        {isLiveSoon && stream.twitchChannel ? (
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
