import LocalDate from "@/components/LocalDate";
import { ProgressBar } from "@/components/ProgressBar";
import { getProgress } from "@/lib/getProgress";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { SeasonCardProps } from "@/components/SeasonCard/SeasonCard.types";
import { Chip } from "@/ui/Chip";

export const CurrentSeasonWidget = ({
  currentSeason,
  seasonKeyword,
  name,
  shortName,
  testProps,
}: Pick<
  SeasonCardProps,
  "currentSeason" | "seasonKeyword" | "name" | "shortName" | "testProps"
>) => {
  if (!currentSeason || !currentSeason.start) {
    return null;
  }

  const hasEnded =
    currentSeason.end?.endDate &&
    new Date().getTime() > new Date(currentSeason.end?.endDate).getTime();

  return (
    <div
      aria-label={`Current ${seasonKeyword}`}
      className="flex flex-col gap-1"
    >
      <div className="flex gap-4 max-sm:items-end sm:flex-col sm:gap-1">
        <div className="flex flex-1 flex-row gap-2">
          <span className="sr-only">{`What is the current ${name} ${seasonKeyword}?`}</span>
          <div className="flex min-w-0 flex-col md:flex-row md:gap-2">
            <div className="hidden sm:block">
              <Chip
                className={
                  currentSeason.start.justStarted
                    ? "!bg-blue-500"
                    : "!bg-slate-500"
                }
              >
                {currentSeason.start.justStarted
                  ? "LIVE"
                  : hasEnded
                    ? "Prev"
                    : "Now"}
              </Chip>
            </div>
            <h4
              className="flex-1 font-heading text-base md:line-clamp-1"
              title={currentSeason.name ?? undefined}
            >
              <MaybeLinkWrapper
                href={currentSeason.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentSeason.name}
              </MaybeLinkWrapper>
            </h4>
            {shortName && (
              <span className="sr-only">{`${shortName} ${currentSeason.name} ${seasonKeyword}`}</span>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-end sm:justify-between">
          <div className="col-span-4 hidden flex-col gap-1 sm:flex">
            <span className="sr-only">{`When did the current ${name} ${seasonKeyword} start?`}</span>
            <div className="flex flex-row gap-2 text-sm">
              {!!currentSeason.start.overrideText ||
              !currentSeason.start?.startDate ? (
                <span>{currentSeason.start.overrideText}</span>
              ) : (
                <div>
                  {shortName && (
                    <span className="sr-only">{`${shortName} ${currentSeason.name} ${seasonKeyword} release date`}</span>
                  )}
                  <LocalDate utcDate={currentSeason.start.startDate} dateOnly />
                </div>
              )}
            </div>
          </div>
          <div>
            <span className="sr-only">{`When is the current ${name} ${seasonKeyword} ending?`}</span>
            <div className="flex flex-row-reverse gap-2 text-sm max-sm:leading-6">
              {!!currentSeason.end?.overrideText ||
              !currentSeason.end?.endDate ? (
                <div className="max-w-32 text-wrap text-right md:max-w-none">
                  {currentSeason.end?.overrideText}
                </div>
              ) : (
                currentSeason.end.confirmed && (
                  <LocalDate utcDate={currentSeason.end.endDate} dateOnly />
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center gap-1">
        <Chip
          className={
            currentSeason.start.justStarted
              ? "!bg-blue-500 sm:hidden"
              : "!bg-slate-500 sm:hidden"
          }
        >
          {currentSeason.start.justStarted ? "LIVE" : hasEnded ? "Prev" : "Now"}
        </Chip>
        <div className="flex-1">
          <ProgressBar
            progress={getProgress(
              currentSeason?.start.startDate,
              currentSeason?.end?.endDate,
              testProps?.now,
            )}
          />
        </div>
      </div>
    </div>
  );
};
