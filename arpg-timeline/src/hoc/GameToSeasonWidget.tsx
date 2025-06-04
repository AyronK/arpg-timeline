import { InfoIcon, TimerReset } from "lucide-react";
import { ReactNode } from "react";

import { CalendarMenu } from "@/components/CalendarMenu";
import { Countdown } from "@/components/Countdown";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import LocalDate from "@/components/LocalDate";
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
    const chip: SeasonChip =
        selector === "next"
            ? "next"
            : isInGracePeriod
              ? "live"
              : season.end?.confirmed && isOver(season.end?.endDate)
                ? "over"
                : "now";

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
                    seasonName={season.name}
                    start={season.start}
                    seasonKeyword={game.seasonKeyword}
                />
                <NextSeasonStartSeoText
                    gameName={game.shortName}
                    seasonName={season.name}
                    start={season.start}
                    seasonKeyword={game.seasonKeyword}
                />
            </>
        );
        if (season.start?.confirmed && season.start.startDate) {
            children = (
                <div className="flex flex-1 flex-col gap-1">
                    {season.start.overrideText ? (
                        <IconLabel icon={TimerReset}>{season.start?.overrideText}</IconLabel>
                    ) : (
                        <IconLabel icon={TimerReset}>
                            Starts
                            <span className="font-semibold">
                                <LocalDate longDate utcDate={season.start.startDate} />
                            </span>
                        </IconLabel>
                    )}
                    {info}
                    {season.start.startDate && (
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
                    seasonName={season.name}
                    startDate={season.start.startDate}
                    seasonKeyword={game.seasonKeyword}
                />
                <PreviousSeasonStartedSeoText
                    gameName={game.shortName}
                    seasonName={season.name}
                    startDate={season.start.startDate}
                    seasonKeyword={game.seasonKeyword}
                />
                <PreviousSeasonEndingSeoText
                    gameName={game.name}
                    seasonName={season.name}
                    end={season.end}
                    seasonKeyword={game.seasonKeyword}
                />
                <PreviousSeasonEndingSeoText
                    gameName={game.shortName}
                    seasonName={season.name}
                    end={season.end}
                    seasonKeyword={game.seasonKeyword}
                />
            </>
        );
        children = (
            <>
                <div className="flex flex-row justify-between">
                    {getProgressStartContent(season.start?.startDate, season.end?.endDate ?? null)}
                    {getProgressEndContent(
                        season.end?.overrideText ?? null,
                        season.end?.confirmed ? season.end.endDate : null,
                    )}
                </div>
                <ProgressBar progress={progress} clamp pulse={isInGracePeriod} />
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
