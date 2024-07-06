import React from "react";
import LocalDate from "./LocalDate";
import { GoogleCalendarButton } from "./GoogleCalendarButton";
import { Countdown } from "./Countdown";
import { ProgressBar } from "./ProgressBar";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";

const Card = (props: {
  title: string;
  logo: ImageDataLike;
  currentSeason: {
    startDate: string;
    endDate: string;
    title: string;
    url: string;
    startDateNotice: string;
    endDateNotice: string;
  };
  nextSeason: {
    startDate: string;
    endDate: string;
    title: string;
    url: string;
    startDateNotice: string;
    endDateNotice: string;
    showCountdown: boolean;
  };
  seasonKeyword: string;
}) => {
  const { title, logo, currentSeason, nextSeason, seasonKeyword } = props;

  const currentTime = Date.now();
  const startTimeMs = new Date(currentSeason.startDate).getTime();
  const endTimeMs = new Date(currentSeason.endDate).getTime();

  const totalDuration = endTimeMs - startTimeMs;
  const elapsedTime = currentTime - startTimeMs;

  const progressPercentage = (elapsedTime / totalDuration) * 100;

  const logoImage = getImage(logo);

  return (
    <section className="card">
      <div className="flex flex-row justify-center min-h-[140px] min-w-[200px]">
        {logoImage && (
          <GatsbyImage
            image={logoImage}
            alt={`${title} logo`}
            className="my-auto"
          />
        )}
      </div>
      <h2 className="sr-only">{title}</h2>
      {currentSeason.title && (
        <div
          aria-label={`Current ${seasonKeyword}`}
          className="flex flex-col gap-1"
        >
          <div className="flex flex-row gap-2">
            <span className="sr-only">{`What is the current ${title} ${seasonKeyword}?`}</span>
            <h3 className="text-lg font-semibold">
              <a
                href={currentSeason.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentSeason.title}
              </a>
            </h3>
          </div>
          <div className="flex flex-col gap-1">
            <span className="sr-only">{`When did the current ${title} ${seasonKeyword} start?`}</span>
            <div>
              <strong>Start date:&nbsp;</strong>
              {currentSeason.startDateNotice !== "" &&
              currentSeason.startDateNotice !== null ? (
                <span>{currentSeason.startDateNotice}</span>
              ) : (
                <LocalDate utcDate={currentSeason.startDate} />
              )}
            </div>
          </div>
          <div>
            <span className="sr-only">{`When is the current ${title} ${seasonKeyword} ending?`}</span>
            <div>
              <strong>End date:&nbsp;</strong>
              {currentSeason.endDateNotice !== "" &&
              currentSeason.endDateNotice !== null ? (
                <span>{currentSeason.endDateNotice}</span>
              ) : (
                <LocalDate utcDate={currentSeason.endDate} />
              )}
            </div>
          </div>
          <ProgressBar progress={progressPercentage} />
        </div>
      )}
      {currentSeason.title && nextSeason.title && <hr className="my-2" />}
      <div aria-label={`Next ${seasonKeyword}`} className="flex flex-col gap-1">
        <span className="sr-only">{`What is the next ${title} ${seasonKeyword}?`}</span>
        <h3 className="text-lg font-semibold">
          <a href={nextSeason.url} target="_blank" rel="noopener noreferrer">
            {nextSeason.title}
          </a>
        </h3>
        {nextSeason.startDate !== "" && (
          <GoogleCalendarButton
            title={`${title} ${seasonKeyword} start`}
            date={new Date(nextSeason.startDate)}
          />
        )}
        <div className="flex flex-col gap-1">
          <span className="sr-only">{`When is the next ${title} ${seasonKeyword} starting?`}</span>
          <div>
            <strong>Start date:&nbsp;</strong>
            {nextSeason.startDateNotice !== "" &&
            nextSeason.startDateNotice !== null ? (
              <span>{nextSeason.startDateNotice}</span>
            ) : (
              <LocalDate utcDate={nextSeason.startDate} />
            )}
          </div>
          {nextSeason.showCountdown && nextSeason.startDate && (
            <Countdown date={new Date(nextSeason.startDate)} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Card;
