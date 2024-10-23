import { CalendarMenu } from "@/components/CalendarMenu";
import { Countdown } from "@/components/Countdown";
import { SeasonChip } from "@/components/CurrentSeasonWidget";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import LocalDate from "@/components/LocalDate";
import { ProgressBar } from "@/components/ProgressBar";
import { SeasonWidget } from "@/components/SeasonWidget";
import { Game } from "@/lib/cms/games.types";
import { inGracePeriod, isOver } from "@/lib/games/sortBySeasons";
import {
  getProgress,
  getProgressEndContent,
  getProgressStartContent,
} from "@/lib/getProgress";
import { InfoIcon, TimerReset } from "lucide-react";
import { ReactNode } from "react";

type Selector = "current" | "next";

const SelectorLabels: Record<Selector, string> = {
  current: "Current",
  next: "Next",
};

export const GameToSeasonWidget = ({
  game,
  selector,
}: {
  game: Game;
  selector: Selector;
}) => {
  const season = selector === "current" ? game.currentSeason : game.nextSeason;

  if (!season) {
    return null;
  }

  const chip: SeasonChip =
    selector === "next"
      ? "next"
      : inGracePeriod(season.start?.startDate)
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

  if (selector === "next") {
    if (season.start?.confirmed && season.start.startDate) {
      children = (
        <div className="flex flex-1 flex-col gap-1">
          {season.start.overrideText ? (
            <IconLabel icon={TimerReset}>
              {season.start?.overrideText}
            </IconLabel>
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
                action={
                  <CalendarMenu
                    startDate={season.start.startDate}
                    title="title"
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
            {season.start?.overrideText ?? "To be announced"}
          </IconLabel>
          {info}
        </>
      );
    }
  } else {
    const progress = getProgress(season.start?.startDate, season.end?.endDate);
    children = (
      <>
        <div className="flex flex-row justify-between">
          {getProgressStartContent(
            season.start?.startDate,
            season.end?.endDate,
          )}
          {getProgressEndContent(
            season.end?.overrideText,
            season.end?.confirmed ? season.end.endDate : null,
          )}
        </div>
        <ProgressBar progress={progress} clamp />
      </>
    );
  }

  //TODO SEO text and aria label
  return (
    <SeasonWidget
      chip={chip}
      name={season.name ?? `${SelectorLabels[selector]} ${game.seasonKeyword}`}
      url={season.url ?? undefined}
    >
      {children}
    </SeasonWidget>
  );
};
