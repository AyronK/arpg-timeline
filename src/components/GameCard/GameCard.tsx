import { CurrentSeasonWidget } from "@/components/CurrentSeasonWidget/CurrentSeasonWidget";
import { NextSearsonWidget } from "@/components/SeasonCard/NextSeasonWidget";
import { UnofficialLabel } from "@/components/UnofficialLabel";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { GameCardProps } from "@/components/GameCard/GameCard.types";

export const GameCard = ({
  name,
  shortName,
  logo,
  url,
  currentSeason,
  nextSeason,
  seasonKeyword,
  official,
  testProps,
}: GameCardProps) => {
  return (
    <section className="relative flex flex-1 flex-col gap-2 rounded-md border bg-card p-4 text-card-foreground md:gap-4 md:p-6">
      <div className="relative flex h-auto max-h-[80px] min-h-[60px] w-[100px] flex-row justify-center place-self-center md:h-[140px] md:max-h-[140px] md:w-[200px]">
        <MaybeLinkWrapper
          href={url}
          rel="nofollow noreferrer"
          className="relative flex flex-col gap-2"
          target="_blank"
        >
          <div>{logo}</div>
        </MaybeLinkWrapper>
      </div>
      <h3 className="sr-only">{name}</h3>
      <CurrentSeasonWidget
        currentSeason={currentSeason}
        gameName={name}
        gameShortName={shortName}
        testProps={testProps}
        seasonKeyword={seasonKeyword}
      />
      {!currentSeason?.start?.justStarted && (
        <NextSearsonWidget
          nextSeason={nextSeason}
          name={name}
          shortName={shortName}
          testProps={testProps}
          seasonKeyword={seasonKeyword}
        />
      )}
      {!official && <UnofficialLabel />}
    </section>
  );
};
