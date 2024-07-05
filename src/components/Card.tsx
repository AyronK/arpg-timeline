import React from 'react';

const Card = (props) => {
  const {
    title,
    logo,
    currentSeason,
    nextSeason,
    seasonKeyword,
  } = props;

  return (
    <section className="card">
      <div className="flex flex-row justify-center min-h-[120px]">
        <img src={logo} width="200" alt={`${title} logo`} className="my-auto" />
      </div>
      <h2 className="sr-only">{title}</h2>
      {currentSeason.title && (
        <div aria-label={`Current ${seasonKeyword}`} className="flex flex-col gap-1">
          <div className="flex flex-row gap-2">
            <span className="sr-only">{`What is the current ${title} ${seasonKeyword}?`}</span>
            <h3 className="text-lg font-semibold">
              <a href={currentSeason.url} target="_blank" rel="noopener noreferrer">{currentSeason.title}</a>
            </h3>
          </div>
          <div className="flex flex-col gap-1">
            <span className="sr-only">{`When did the current ${title} ${seasonKeyword} start?`}</span>
            <div>
              <strong>Start date:&nbsp;</strong>
              {currentSeason.startDateNotice !== "" && currentSeason.startDateNotice !== null ? (
                <span>{currentSeason.startDateNotice}</span>
              ) : (
                <span data-date-utc>{currentSeason.startDate}</span>
              )}
            </div>
          </div>
          <div>
            <span className="sr-only">{`When is the current ${title} ${seasonKeyword} ending?`}</span>
            <div>
              <strong>End date:&nbsp;</strong>
              {currentSeason.endDateNotice !== "" && currentSeason.endDateNotice !== null ? (
                <span>{currentSeason.endDateNotice}</span>
              ) : (
                <span data-date-utc>{currentSeason.endDate}</span>
              )}
            </div>
          </div>
          <div className="h-4 mt-2 bg-gray-500 rounded-full overflow-hidden relative" style={{ width: '100%' }} data-progress data-start-time={currentSeason.startDate} data-end-time={currentSeason.endDate}>
            <div className="h-full bg-emerald-200 rounded-full"></div>
          </div>
        </div>
      )}
      <hr className="my-2" />
      <div aria-label={`Next ${seasonKeyword}`} className="flex flex-col gap-1">
        <span className="sr-only">{`What is the next ${title} ${seasonKeyword}?`}</span>
        <h3 className="text-lg font-semibold">
          <a href={nextSeason.url} target="_blank" rel="noopener noreferrer">{nextSeason.title}</a>
        </h3>
        {nextSeason.startDate !== "" && (
          <button title="Add to google calendar" data-action="google-calendar" data-date={nextSeason.startDate} data-time={nextSeason.startDate} data-title={`${title} ${seasonKeyword} start`}>
            <img width="24" height="24" src="./assets/google-calenda.webp" alt="Add to calendar" />
          </button>
        )}
        <div className="flex flex-col gap-1">
          <span className="sr-only">{`When is the next ${title} ${seasonKeyword} starting?`}</span>
          <div>
            <strong>Start date:&nbsp;</strong>
            {nextSeason.startDateNotice !== "" && nextSeason.startDateNotice !== null ? (
              <span>{nextSeason.startDateNotice}</span>
            ) : (
              <span data-date-utc>{nextSeason.startDate}</span>
            )}
          </div>
          {nextSeason.showCountdown && (
            <div data-date={nextSeason.startDate} data-countdown className="mt-2 font-mono text-2xl font-bold text-orange-300 ml-auto"></div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Card;
