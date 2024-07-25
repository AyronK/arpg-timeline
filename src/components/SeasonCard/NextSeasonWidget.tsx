import LocalDate from "@/components/LocalDate";
import { Countdown } from "@/components/Countdown";
import { CalendarMenu } from "@/components/CalendarMenu";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { SeasonCardProps } from "@/components/SeasonCard/SeasonCard.types";
import { Chip } from "@/ui/Chip";

export const NextSearsonWidget = ({
  nextSeason,
  seasonKeyword,
  title,
  shortName,
  testProps,
}: Pick<
  SeasonCardProps,
  "nextSeason" | "seasonKeyword" | "title" | "shortName" | "testProps"
>) => {
  if (!nextSeason?.title) {
    return null;
  }

  return (
    <div
      aria-label={`Next ${seasonKeyword}`}
      className="mt-auto flex flex-col gap-1"
    >
      <div className="flex flex-row justify-between gap-2">
        <span className="sr-only">{`What is the next ${title} ${seasonKeyword}?`}</span>
        <div className="flex min-w-0 flex-col md:flex-row md:gap-2">
          <div className="hidden sm:block">
            <Chip>Next</Chip>
          </div>
          <h4
            className="flex-1 text-base font-semibold sm:text-lg md:line-clamp-1"
            title={nextSeason.title}
          >
            <MaybeLinkWrapper
              href={nextSeason.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {nextSeason.title}
            </MaybeLinkWrapper>
          </h4>
          {shortName && (
            <span className="sr-only">{`${shortName} ${nextSeason.title} ${seasonKeyword}`}</span>
          )}
        </div>
        {nextSeason.showCountdown && nextSeason.startDate && (
          <div className="flex h-6 max-sm:flex md:h-[28px]">
            <CalendarMenu
              startDate={nextSeason.startDate}
              title={`${title} ${seasonKeyword} start`}
            />
          </div>
        )}
      </div>
      <div className="flex min-h-[28px] flex-row justify-between sm:items-baseline">
        <span className="sr-only">{`When is the next ${title} ${seasonKeyword} starting?`}</span>
        <div className="flex flex-row gap-2 text-sm">
          {!!nextSeason.startDateNotice || !nextSeason.startDate ? (
            <div className="flex items-center gap-1">
              <Chip className="sm:hidden">Next</Chip>
              <span>{nextSeason.startDateNotice}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {shortName && (
                <span className="sr-only">{`${shortName} ${nextSeason.title} ${seasonKeyword} release date`}</span>
              )}
              <Chip className="sm:hidden">Next</Chip>
              <LocalDate utcDate={nextSeason.startDate} />
            </div>
          )}
        </div>
        {nextSeason.showCountdown && nextSeason.startDate && (
          <Countdown
            date={new Date(nextSeason.startDate)}
            testProps={testProps ? { timeLeft: testProps.timeLeft } : undefined}
          />
        )}
      </div>
    </div>
  );
};
