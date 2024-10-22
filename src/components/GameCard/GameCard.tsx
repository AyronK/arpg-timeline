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
    <section className="relative flex flex-1 flex-col gap-3 rounded-md border bg-card p-4 text-card-foreground md:gap-4">
      <div className="flex flex-row items-center justify-between">
        <h3 className="font-heading text-xs md:text-sm">{name}</h3>
        {!official && <UnofficialLabel />}
      </div>
      <div className="relative flex h-auto max-h-[80px] min-h-[60px] w-[100px] flex-row justify-center place-self-center md:h-[140px] md:max-h-[140px] md:w-[200px]">
        <MaybeLinkWrapper
          href={url}
          rel="nofollow noreferrer"
          className="relative flex flex-col gap-2"
          target="_blank"
        >
          <div className="grid min-h-[60px] overflow-hidden md:min-h-[140px]">
            {logo}
          </div>
        </MaybeLinkWrapper>
      </div>
      <div className="md:min-h-[64px]">
        {currentSeason && <CurrentSeasonWidget {...currentSeason} />}
      </div>
      {nextSeason && <NextSeasonWidget {...nextSeason} />}
    </section>
  );
};
