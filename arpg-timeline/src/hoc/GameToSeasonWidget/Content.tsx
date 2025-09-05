"use client";
import { InfoIcon, TimerReset } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { CalendarMenu } from "@/components/CalendarMenu";
import ClientOnlyVisibleWrapper from "@/components/ClientOnlyVisibleWrapper";
import { Countdown } from "@/components/Countdown";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import LocalDate from "@/components/LocalDate";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { ProgressBar } from "@/components/ProgressBar";
import { ShareMenu } from "@/components/ShareMenu";
import { Game } from "@/lib/cms/games.types";
import { inGracePeriod } from "@/lib/games/sortBySeasons";
import { getProgress, getProgressEndContent, getProgressStartContent } from "@/lib/getProgress";
import { cn } from "@/lib/utils";

import { Selector } from "./types";
export const Content = ({
    game,
    selector,
    embed,
    compactEmbed,
}: {
    game: Game;
    selector: Selector;
    embed?: boolean | undefined;
    compactEmbed?: boolean | undefined;
}) => {
    const season = selector === "current" ? game.currentSeason : game.nextSeason;
    const router = useRouter();

    useEffect(() => {
        if (season?.start?.startDate && season.start?.confirmed) {
            const startDate = new Date(season.start.startDate);
            const now = new Date();
            if (startDate > now) {
                const timeUntilStart = startDate.getTime() - now.getTime();
                const timeoutId = setTimeout(() => {
                    router.refresh();
                }, timeUntilStart);

                return () => clearTimeout(timeoutId);
            }
        }
    }, [router, season]);

    if (!season) {
        return null;
    }

    const isInGracePeriod = inGracePeriod(season.start?.startDate);
    const info = (season.start?.additionalText || season.end?.additionalText) && !compactEmbed && (
        <IconLabel icon={InfoIcon} className="text-xs" iconPosition="end">
            {season.start?.additionalText || season.end?.additionalText}
        </IconLabel>
    );

    if (selector === "next") {
        if (season.start?.confirmed && season.start.startDate) {
            return (
                <div className="flex flex-1 flex-col gap-1 md:gap-2">
                    {!compactEmbed && (
                        <div className="flex flex-row flex-nowrap justify-between">
                            {season.start.overrideText ? (
                                <IconLabel icon={TimerReset}>
                                    {season.start?.overrideText}
                                </IconLabel>
                            ) : (
                                <ClientOnlyVisibleWrapper>
                                    <IconLabel icon={TimerReset}>
                                        Starts
                                        <span className="font-semibold">
                                            <LocalDate longDate utcDate={season.start.startDate} />
                                        </span>
                                    </IconLabel>
                                </ClientOnlyVisibleWrapper>
                            )}
                            {season.patchNotesUrl && (
                                <MaybeLinkWrapper
                                    href={season.patchNotesUrl}
                                    target="_blank"
                                    className="text-primary hover:text-primary/80 ml-auto text-sm text-nowrap hover:underline"
                                    data-sa-click={`${season.name}-patch-notes`}
                                >
                                    Patch notes
                                </MaybeLinkWrapper>
                            )}
                        </div>
                    )}
                    {info}
                    {season.start.startDate && (
                        <ClientOnlyVisibleWrapper>
                            {embed ? (
                                <div
                                    className={cn("mt-auto rounded-sm", {
                                        "ring ring-emerald-200/40": !compactEmbed,
                                        "scale-125": compactEmbed,
                                    })}
                                >
                                    <FramedAction
                                        className={cn({
                                            "bg-transparent! shadow-none!": compactEmbed,
                                            "p-1": !compactEmbed,
                                        })}
                                    >
                                        <Countdown date={new Date(season.start.startDate)} />
                                    </FramedAction>
                                </div>
                            ) : (
                                <div className="mt-auto">
                                    <FramedAction
                                        prependClassName="!rounded-r-none"
                                        prepend={
                                            <ShareMenu
                                                startDate={season.start.startDate}
                                                title={`Hey, ${game.name} ${season.name} launch is happening`}
                                            />
                                        }
                                        appendClassName="!rounded-l-none"
                                        append={
                                            <CalendarMenu
                                                startDate={season.start.startDate}
                                                title={`${game.name} ${season.name} launch`}
                                            />
                                        }
                                    >
                                        <Countdown date={new Date(season.start.startDate)} />
                                    </FramedAction>
                                </div>
                            )}
                        </ClientOnlyVisibleWrapper>
                    )}
                </div>
            );
        } else {
            return (
                <>
                    <IconLabel icon={TimerReset}>
                        <i>
                            {season.start?.overrideText ??
                                game.currentSeason?.end?.overrideText ??
                                "To be announced"}
                        </i>
                    </IconLabel>
                    {info}
                </>
            );
        }
    } else if (season.start?.startDate) {
        const progress = getProgress(season.start?.startDate, season.end?.endDate ?? null);
        return (
            <>
                <div className="flex flex-row flex-nowrap justify-between">
                    <ClientOnlyVisibleWrapper>
                        {getProgressStartContent(
                            season.start?.startDate,
                            season.end?.endDate ?? null,
                            null,
                            game.isDormant,
                        )}
                    </ClientOnlyVisibleWrapper>
                    <ClientOnlyVisibleWrapper>
                        {getProgressEndContent(
                            season.end?.overrideText ?? null,
                            season.end?.confirmed ? season.end?.endDate : null,
                        )}
                    </ClientOnlyVisibleWrapper>
                </div>
                {!game.isDormant && (
                    <ProgressBar progress={progress} clamp pulse={isInGracePeriod} />
                )}
            </>
        );
    }
};
