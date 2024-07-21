import React from "react";
import LocalDate from "./LocalDate";
import { Countdown } from "./Countdown";
import { ProgressBar } from "./ProgressBar";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
import { Chip } from "./Chip";
import { CalendarMenu } from "./CalendarMenu";
import { getProgress } from "../lib/getProgress";

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
            <a href={nextSeason.url} target="_blank" rel="noopener noreferrer">
              {nextSeason.title}
            </a>
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
    <section className="relative flex flex-col gap-2 rounded-md border bg-card p-4 text-card-foreground md:gap-4 md:p-6">
      <div className="relative flex h-auto max-h-[80px] min-h-[60px] w-[100px] flex-row justify-center place-self-center md:h-[140px] md:max-h-[140px] md:w-[200px]">
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
          className="absolute left-4 top-2 font-mono text-xs font-semibold tracking-wider text-yellow-400 opacity-75 md:text-sm"
          title="This is not an official game or cycle, which means it is not actively supported by the publishers."
        >
          UNOFFICIAL*
        </span>
      )}
    </section>
  );
};

export default SeasonCard;
