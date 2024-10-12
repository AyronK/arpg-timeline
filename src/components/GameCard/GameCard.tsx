import { UnofficialLabel } from "@/components/UnofficialLabel";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { GameCardProps } from "@/components/GameCard/GameCard.types";
import { CurrentSeasonWidget } from "@/components/CurrentSeasonWidget";
import { NextSeasonWidget } from "@/components/NextSeasonWidget";

export const GameCard = ({
  name,
  logo,
  url,
  currentSeason,
  nextSeason,
  official,
}: GameCardProps) => {
  return (
    <section className="relative flex flex-1 flex-col gap-5 rounded-md border bg-card p-4 text-card-foreground md:gap-6">
      <div className="relative flex h-auto max-h-[80px] min-h-[60px] w-[100px] flex-row justify-center place-self-center md:h-[140px] md:max-h-[140px] md:w-[200px]">
        <MaybeLinkWrapper
          href={url}
          rel="nofollow noreferrer"
          className="relative flex flex-col gap-2"
          target="_blank"
        >
          <div className="overflow-hidden">{logo}</div>
        </MaybeLinkWrapper>
      </div>
      <h3 className="sr-only">{name}</h3>
      {currentSeason && <CurrentSeasonWidget {...currentSeason} />}
      {nextSeason && <NextSeasonWidget {...nextSeason} />}
      {!official && <UnofficialLabel />}
    </section>
  );
};
