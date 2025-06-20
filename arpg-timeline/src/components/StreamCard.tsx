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
        <h3 className="font-heading mt-auto text-xs text-nowrap">
            {gameName} - {name}
        </h3>
        <ClientOnlyVisibleWrapper>
            <div className="hidden lg:block">
                {Date.now() < new Date(date).getTime() && (
                    <IconLabel icon={TimerReset}>
                        <span className="font-semibold">
                            <LocalDate longDate utcDate={date} />
                        </span>
                    </IconLabel>
                )}
            </div>
        </ClientOnlyVisibleWrapper>
    </div>
);

const WatchNowAction = ({
    twitchChannel,
    gameSlug,
}: {
    twitchChannel: string;
    gameSlug: string;
}) => (
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
                    rel="noreferrer"
                    onClick={() => sa_event(`${gameSlug}-twitch-channel-click`)}
                    href={`https://www.twitch.tv/${twitchChannel}`}
                >
                    <Twitch className="h-4 w-4" />
                </a>
            </Button>
        }
    >
        Watch now!
    </FramedAction>
);

const CountdownAction = ({ stream }: { stream: GameStream }) => (
    <FramedAction
        prependClassName="!rounded-r-none"
        prepend={
            <ShareMenu
                startDate={stream.date ?? ""}
                title={`Hey, ${stream.gameName} ${stream.name} stream is soon live on Twitch`}
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
            className="text-card-foreground bg-card relative flex flex-row gap-4 rounded-lg border-2 border-[#6441a5]/40 p-4"
            key={stream.slug}
        >
            <div className="hidden h-4 w-4 md:flex md:h-16 md:w-16">
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
            <div className="flex flex-1 flex-col gap-1">
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
