import LocalDate from "@/components/LocalDate";
import { Countdown } from "@/components/Countdown";
import { CalendarMenu } from "@/components/CalendarMenu";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { SeasonCardProps } from "@/components/SeasonCard/SeasonCard.types";
import { Chip } from "@/ui/Chip";

export const NextSearsonWidget = ({
  nextSeason,
  seasonKeyword,
  name,
  shortName,
  testProps,
}: Pick<
  SeasonCardProps,
  "nextSeason" | "seasonKeyword" | "name" | "shortName" | "testProps"
>) => {
  if (!nextSeason || !nextSeason.start) {
    return null;
  }

  return (
    <div
      aria-label={`Next ${seasonKeyword}`}
      className="mt-auto flex flex-col gap-1"
    >
      <div className="flex flex-row justify-between gap-2">
        <span className="sr-only">{`What is the next ${name} ${seasonKeyword}?`}</span>
        <div className="flex min-w-0 flex-col md:flex-row md:gap-2">
          <div className="hidden sm:block">
            <Chip>Next</Chip>
          </div>
          <h4
            className="flex-1 font-heading text-base md:line-clamp-1"
            title={nextSeason.name ?? undefined}
          >
            <MaybeLinkWrapper
              href={nextSeason.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {nextSeason.name}
            </MaybeLinkWrapper>
          </h4>
          {shortName && (
            <span className="sr-only">{`${shortName} ${nextSeason.name} ${seasonKeyword}`}</span>
          )}
        </div>
        {nextSeason.start.confirmed && nextSeason.start.startDate && (
          <div className="flex h-6 max-sm:flex md:h-[28px]">
            <CalendarMenu
              startDate={nextSeason.start.startDate}
              title={`${name} ${seasonKeyword} start`}
            />
          </div>
        )}
      </div>
      <div className="flex min-h-[28px] flex-row justify-between sm:items-baseline">
        <span className="sr-only">{`When is the next ${name} ${seasonKeyword} starting?`}</span>
        <div className="flex flex-row gap-2 text-sm">
          {!!nextSeason.start.overrideText || !nextSeason.start.startDate ? (
            <div className="flex items-center gap-1">
              <Chip className="sm:hidden">Next</Chip>
              <span>{nextSeason.start.overrideText}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {shortName && (
                <span className="sr-only">{`${shortName} ${nextSeason.name} ${seasonKeyword} release date`}</span>
              )}
              <Chip className="sm:hidden">Next</Chip>
              <LocalDate utcDate={nextSeason.start.startDate} />
            </div>
          )}
        </div>
        {nextSeason.start.confirmed && nextSeason.start.startDate && (
          <Countdown
            date={new Date(nextSeason.start.startDate)}
            testProps={testProps ? { timeLeft: testProps.timeLeft } : undefined}
          />
        )}
      </div>
    </div>
  );
};
