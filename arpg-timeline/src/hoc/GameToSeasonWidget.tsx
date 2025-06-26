import { InfoIcon, TimerReset } from "lucide-react";
import { ReactNode } from "react";

import { CalendarMenu } from "@/components/CalendarMenu";
import ClientOnlyVisibleWrapper from "@/components/ClientOnlyVisibleWrapper";
import { Countdown } from "@/components/Countdown";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import LocalDate from "@/components/LocalDate";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { ProgressBar } from "@/components/ProgressBar";
import { SeasonChip } from "@/components/SeasonWidget";
import { SeasonWidget } from "@/components/SeasonWidget";
import { ShareMenu } from "@/components/ShareMenu";
import { NextSeasonStartSeoText } from "@/hoc/NextSeasonStartSeoText";
import { PreviousSeasonEndingSeoText } from "@/hoc/PreviousSeasonEndingSeoText";
import { PreviousSeasonStartedSeoText } from "@/hoc/PreviousSeasonStartedSeoText";
import { Game } from "@/lib/cms/games.types";
import { inGracePeriod, isOver } from "@/lib/games/sortBySeasons";
import { getProgress, getProgressEndContent, getProgressStartContent } from "@/lib/getProgress";

type Selector = "current" | "next";

const SelectorLabels: Record<Selector, string> = {
    current: "Current",
    next: "The next",
};

export const GameToSeasonWidget = ({ game, selector }: { game: Game; selector: Selector }) => {
    const season = selector === "current" ? game.currentSeason : game.nextSeason;

    if (!season) {
        return null;
    }

    const isInGracePeriod = inGracePeriod(season.start?.startDate);
    let chip: SeasonChip;

    if (game.isDormant) {
        chip = "dormant";
    } else if (selector === "next") {
        chip = game.isComingSoon ? "comingSoon" : "next";
    } else if (isInGracePeriod) {
        chip = "live";
    } else if (season.end?.confirmed && isOver(season.end.endDate)) {
        chip = "over";
    } else {
        chip = "now";
    }

    const info = (season.start?.additionalText || season.end?.additionalText) && (
        <IconLabel icon={InfoIcon} className="text-xs" iconPosition="end">
            {season.start?.additionalText || season.end?.additionalText}
        </IconLabel>
    );

    let children: ReactNode;
    let seoText: ReactNode;

    if (selector === "next") {
        seoText = (
            <>
                <NextSeasonStartSeoText
                    gameName={game.name}
                    seasonName={season.name!}
                    start={season.start!}
                    seasonKeyword={game.seasonKeyword}
                />
                <NextSeasonStartSeoText
                    gameName={game.shortName!}
                    seasonName={season.name!}
                    start={season.start!}
                    seasonKeyword={game.seasonKeyword}
                />
            </>
        );
        if (season.start?.confirmed && season.start.startDate) {
            children = (
                <div className="flex flex-1 flex-col gap-1 md:gap-2">
                    <div className="flex flex-row flex-nowrap justify-between">
                        {season.start.overrideText ? (
                            <IconLabel icon={TimerReset}>{season.start?.overrideText}</IconLabel>
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
                                className="ml-auto text-sm text-nowrap hover:underline"
                                data-sm-click={`${season.name}-patch-notes`}
                            >
                                Patch notes
                            </MaybeLinkWrapper>
                        )}
                    </div>
                    {info}
                    {season.start.startDate && (
                        <ClientOnlyVisibleWrapper>
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
                        </ClientOnlyVisibleWrapper>
                    )}
                </div>
            );
        } else {
            children = (
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
        seoText = season.start?.startDate && (
            <>
                <PreviousSeasonStartedSeoText
                    gameName={game.name}
                    seasonName={season.name!}
                    startDate={season.start.startDate}
                    seasonKeyword={game.seasonKeyword}
                />
                <PreviousSeasonStartedSeoText
                    gameName={game.shortName!}
                    seasonName={season.name!}
                    startDate={season.start.startDate}
                    seasonKeyword={game.seasonKeyword}
                />
                <PreviousSeasonEndingSeoText
                    gameName={game.name}
                    seasonName={season.name!}
                    end={season.end!}
                    seasonKeyword={game.seasonKeyword}
                />
                <PreviousSeasonEndingSeoText
                    gameName={game.shortName!}
                    seasonName={season.name!}
                    end={season.end!}
                    seasonKeyword={game.seasonKeyword}
                />
            </>
        );
        children = (
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

    return (
        <SeasonWidget
            aria-label={`${selector} ${game.name} ${game.seasonKeyword} - ${season.name}`}
            chip={chip}
            name={season.name ?? `${SelectorLabels[selector]} ${game.seasonKeyword}`}
            url={season.url ?? undefined}
        >
            <div className="sr-only">{seoText}</div>
            {children}
        </SeasonWidget>
    );
};
