import { GameCard } from "@/components/GameCard/GameCard";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { SanityImage } from "@/components/SanityImage";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget/GameToSeasonWidget";
import { inGracePeriod } from "@/lib/games/sortBySeasons";

import { GameHeaderSectionProps } from "../types";
import { QuickLinksSection } from "./QuickLinksSection";

export const GameHeaderSection = ({ game, gameSlug, steamAppId }: GameHeaderSectionProps) => (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:gap-6 lg:flex-row">
        <GameCard
            noMenu
            name={game.name}
            gameLogo={
                game.logo ? (
                    <SanityImage
                        loading="lazy"
                        src={game.logo}
                        alt={`${game.name} logo`}
                        className="my-auto"
                        width={160}
                        height={140}
                        objectFit="contain"
                    />
                ) : (
                    <div className="bg-muted text-muted-foreground my-auto flex h-[140px] w-[160px] items-center justify-center">
                        No Logo
                    </div>
                )
            }
            slug={game.slug}
            shortName={game.shortName || game.name}
            url={game.url || "#"}
            official={!game.categories?.includes("community")}
            stats={{}}
        >
            <GameToSeasonWidget game={game} selector="current" />
            {inGracePeriod(game.currentSeason?.start?.startDate) ? (
                game.currentSeason?.patchNotesUrl && (
                    <div className="mt-auto flex flex-col gap-2">
                        <MaybeLinkWrapper
                            href={game.currentSeason?.patchNotesUrl}
                            target="_blank"
                            className="text-primary hover:text-primary/80 ml-auto text-sm text-nowrap hover:underline"
                            data-sa-click={`${game.currentSeason?.name}-patch-notes`}
                        >
                            Patch notes
                        </MaybeLinkWrapper>
                    </div>
                )
            ) : (
                <GameToSeasonWidget game={game} selector="next" />
            )}
        </GameCard>

        <QuickLinksSection game={game} gameSlug={gameSlug} steamAppId={steamAppId} />
    </div>
);
