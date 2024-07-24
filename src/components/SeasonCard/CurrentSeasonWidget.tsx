import LocalDate from "@/components/LocalDate";
import { ProgressBar } from "@/components/ProgressBar";
import { getProgress } from "@/lib/getProgress";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { SeasonCardProps } from "@/components/SeasonCard/SeasonCard.types";
import { Chip } from "@/ui/Chip";

export const CurrentSeasonWidget = ({
  currentSeason,
  seasonKeyword,
  title,
  shortName,
  testProps,
}: Pick<
  SeasonCardProps,
  "currentSeason" | "seasonKeyword" | "title" | "shortName" | "testProps"
>) => {
  if (!currentSeason?.title) {
    return null;
  }

  return (
    <div
      aria-label={`Current ${seasonKeyword}`}
      className="flex flex-col gap-1"
    >
      <div className="flex gap-4 max-sm:items-end sm:flex-col sm:gap-1">
        <div className="flex flex-1 flex-row gap-2">
          <span className="sr-only">{`What is the current ${title} ${seasonKeyword}?`}</span>
          <div className="flex min-w-0 flex-col md:flex-row md:gap-2">
            <div className="hidden sm:block">
              <Chip
                className={
                  currentSeason.justStarted ? "!bg-blue-500" : "!bg-slate-500"
                }
              >
                {currentSeason.justStarted ? "LIVE" : "Now"}
              </Chip>
            </div>
            <h4
              className="flex-1 text-base font-semibold sm:text-lg md:line-clamp-1"
              title={currentSeason.title}
            >
              <MaybeLinkWrapper
                href={currentSeason.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentSeason.title}
              </MaybeLinkWrapper>
            </h4>
            {shortName && (
              <span className="sr-only">{`${shortName} ${currentSeason.title} ${seasonKeyword}`}</span>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-end sm:justify-between">
          <div className="col-span-4 hidden flex-col gap-1 sm:flex">
            <span className="sr-only">{`When did the current ${title} ${seasonKeyword} start?`}</span>
            <div className="flex flex-row gap-2 text-sm">
              {!!currentSeason.startDateNotice || !currentSeason.startDate ? (
                <span>{currentSeason.startDateNotice}</span>
              ) : (
                <div>
                  {shortName && (
                    <span className="sr-only">{`${shortName} ${currentSeason.title} ${seasonKeyword} release date`}</span>
                  )}
                  <LocalDate utcDate={currentSeason.startDate} dateOnly />
                </div>
              )}
            </div>
          </div>
          <div>
            <span className="sr-only">{`When is the current ${title} ${seasonKeyword} ending?`}</span>
            <div className="flex flex-row-reverse gap-2 text-sm max-sm:leading-6">
              {!!currentSeason.endDateNotice || !currentSeason.endDate ? (
                <div className="max-w-32 text-wrap text-right md:max-w-none">
                  {currentSeason.endDateNotice}
                </div>
              ) : (
                <LocalDate utcDate={currentSeason.endDate} dateOnly />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center gap-1">
        <Chip
          className={
            currentSeason.justStarted
              ? "!bg-blue-500 sm:hidden"
              : "!bg-slate-500 sm:hidden"
          }
        >
          {currentSeason.justStarted ? "LIVE" : "Now"}
        </Chip>
        <div className="flex-1">
          <ProgressBar
            progress={getProgress(
              currentSeason?.startDate,
              currentSeason?.endDate,
              testProps?.now,
            )}
          />
        </div>
      </div>
    </div>
  );
};
