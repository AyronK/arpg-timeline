import { CommunityLabel } from "@/components/CommunityLabel";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { GameCardProps } from "@/components/GameCard/GameCard.types";

export const GameCard = ({
  name,
  logo,
  url,
  children,
  official,
}: GameCardProps) => {
  return (
    <section className="bg-card text-card-foreground relative flex flex-1 flex-col gap-1 rounded-md border p-4">
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <h3 className="font-heading text-xs">{name}</h3>
          {!official && <CommunityLabel />}
        </div>
        <div className="relative flex min-h-[80px] w-[120px] flex-row justify-center place-self-center md:h-[140px] md:w-[160px]">
          <MaybeLinkWrapper
            href={url}
            rel="nofollow noreferrer"
            className="relative flex flex-col gap-2"
            target="_blank"
          >
            <div className="grid min-h-[72px] w-[120px] md:h-[140px] md:w-[160px]">
              {logo}
            </div>
          </MaybeLinkWrapper>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 md:gap-4">{children}</div>
    </section>
  );
};
