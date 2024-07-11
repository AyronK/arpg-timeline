import React from "react";
import LocalDate from "./LocalDate";
import { Countdown } from "./Countdown";
import { ProgressBar } from "./ProgressBar";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
import { Chip } from "./Chip";
import { CalendarMenu } from "./CalendarMenu";

type SeasonCardProps = Partial<{
  title: string;
  shortName: string;
  logo: ImageDataLike;
  official: boolean;
  url: string;
  currentSeason: Partial<{
    startDate: string;
    endDate: string;
    title: string;
    url: string;
    startDateNotice: string;
    endDateNotice: string;
    justStarted?: boolean;
  }>;
  nextSeason: Partial<{
    startDate: string;
    endDate: string;
    title: string;
    url: string;
    startDateNotice: string;
    endDateNotice: string;
    showCountdown: boolean;
  }>;
  seasonKeyword: string;
  testProps: {
    now?: Date;
    timeLeft?: number;
  };
}>;

const getProgress = (
  startDate: string | undefined,
  endDate: string | undefined,
  currentTime?: Date | undefined,
) => {
  if (!startDate || !endDate) {
    return 0;
  }

  const now = currentTime?.getTime() ?? Date.now();
  const startTimeMs = new Date(startDate).getTime();
  const endTimeMs = new Date(endDate).getTime();

  const totalDuration = endTimeMs - startTimeMs;
  const elapsedTime = now - startTimeMs;

  const progressPercentage = (elapsedTime / totalDuration) * 100;

  return progressPercentage;
};

const NextSearsonWidget = ({
  nextSeason,
  seasonKeyword,
  title,
  shortName,
  testProps,
}: Omit<SeasonCardProps, "currentSeason">) => {
  if (!nextSeason?.title) {
    return null;
  }

  return (
    <div
      aria-label={`Next ${seasonKeyword}`}
      className="flex flex-col gap-1 mt-auto"
    >
      <div className="flex flex-row gap-2 justify-between">
        <span className="sr-only">{`What is the next ${title} ${seasonKeyword}?`}</span>
        <div className="flex flex-col md:flex-row md:gap-2 min-w-0">
          <div className="hidden sm:block">
            <Chip>Next</Chip>
          </div>
          <h4
            className="text-base sm:text-lg font-semibold flex-1 md:line-clamp-1"
            title={nextSeason.title}
          >
            <a href={nextSeason.url} target="_blank" rel="noopener noreferrer">
              {nextSeason.title}
            </a>
          </h4>
          {shortName && (
            <span className="sr-only">{`${shortName} ${nextSeason.title} ${seasonKeyword}`}</span>
          )}
        </div>
        {nextSeason.showCountdown && nextSeason.startDate && (
          <div className="md:h-[28px] h-6 max-sm:flex flex">
            <CalendarMenu
              startDate={nextSeason.startDate}
              title={`${title} ${seasonKeyword} start`}
            />
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between sm:items-baseline min-h-[28px]">
        <span className="sr-only">{`When is the next ${title} ${seasonKeyword} starting?`}</span>
        <div className="flex flex-row gap-2 text-sm">
          {!!nextSeason.startDateNotice || !nextSeason.startDate ? (
            <div className="gap-1 flex items-center">
              <Chip className="sm:hidden">Next</Chip>
              <span>{nextSeason.startDateNotice}</span>
            </div>
          ) : (
            <div className="gap-1 flex items-center">
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

const CurrentSeasonWidget = ({
  currentSeason,
  seasonKeyword,
  title,
  shortName,
  testProps,
}: Omit<SeasonCardProps, "nextSeason">) => {
  if (!currentSeason?.title) {
    return null;
  }

  return (
    <div
      aria-label={`Current ${seasonKeyword}`}
      className="flex flex-col gap-1"
    >
      <div className="gap-4 sm:gap-1 flex sm:flex-col max-sm:items-end">
        <div className="flex flex-row gap-2 flex-1">
          <span className="sr-only">{`What is the current ${title} ${seasonKeyword}?`}</span>
          <div className="flex flex-col md:flex-row md:gap-2 min-w-0">
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
              className="text-base sm:text-lg font-semibold flex-1 md:line-clamp-1"
              title={currentSeason.title}
            >
              <a
                href={currentSeason.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentSeason.title}
              </a>
            </h4>
            {shortName && (
              <span className="sr-only">{`${shortName} ${currentSeason.title} ${seasonKeyword}`}</span>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-end sm:justify-between">
          <div className="flex-col gap-1 col-span-4 hidden sm:flex">
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
                <div className="max-w-32 md:max-w-none text-wrap text-right">
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

const SeasonCard = (props: SeasonCardProps) => {
  const {
    title,
    shortName,
    logo,
    url,
    currentSeason,
    nextSeason,
    seasonKeyword,
    official,
  } = props;

  return (
    <section className="relative border p-4 md:p-6 rounded-md flex flex-col gap-2 md:gap-4 bg-card text-card-foreground">
      <div className="relative flex flex-row justify-center min-h-[60px] h-auto w-[100px] max-h-[80px] md:h-[140px] md:w-[200px] md:max-h-[140px] place-self-center">
        <a
          href={url}
          rel="nofollow noreferrer"
          className="relative flex flex-col gap-2"
          target="_blank"
        >
          <GatsbyImage
            image={getImage(logo!)!}
            alt={`${title} logo`}
            className="my-auto"
          />
        </a>
      </div>
      <h3 className="sr-only">{title}</h3>
      <CurrentSeasonWidget
        currentSeason={currentSeason}
        title={title}
        shortName={shortName}
        testProps={props.testProps}
        seasonKeyword={seasonKeyword}
      />
      {!currentSeason?.justStarted && (
        <NextSearsonWidget
          nextSeason={nextSeason}
          title={title}
          shortName={shortName}
          testProps={props.testProps}
          seasonKeyword={seasonKeyword}
        />
      )}
      {!official && (
        <span
          className="absolute font-mono top-2 left-4 font-semibold text-yellow-400 opacity-75 text-xs md:text-sm tracking-wider"
          title="This is not an official game or cycle, which means it is not actively supported by the publishers."
        >
          UNOFFICIAL*
        </span>
      )}
    </section>
  );
};

export default SeasonCard;
