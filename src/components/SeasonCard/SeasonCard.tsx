import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { CurrentSeasonWidget } from "./CurrentSeasonWidget";
import { SeasonCardProps } from "./SeasonCard.types";
import { NextSearsonWidget } from "./NextSeasonWidget";
import { UnofficialLabel } from "../UnofficialLabel";

export const SeasonCard = ({
  title,
  shortName,
  logo,
  url,
  currentSeason,
  nextSeason,
  seasonKeyword,
  official,
  testProps,
}: SeasonCardProps) => {
  return (
    <section className="relative flex flex-1 flex-col gap-2 rounded-md border bg-card p-4 text-card-foreground md:gap-4 md:p-6">
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
        testProps={testProps}
        seasonKeyword={seasonKeyword}
      />
      {!currentSeason?.justStarted && (
        <NextSearsonWidget
          nextSeason={nextSeason}
          title={title}
          shortName={shortName}
          testProps={testProps}
          seasonKeyword={seasonKeyword}
        />
      )}
      {!official && <UnofficialLabel />}
    </section>
  );
};
