import { CommunityLabel } from "@/components/CommunityLabel";
import { SanityImage } from "@/components/SanityImage";
import { SteamPlayersChip } from "@/components/SteamPlayersChip";
import { Game, Season } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";

import { getHubTabs, HubTabFlags } from "../../hub";
import { EarlyAccessChip } from "../InfoChips";
import { HubActions } from "./HubActions";
import { HubBreadcrumbs, HubTabs, HubTitle } from "./HubNav";
import { HubStatus } from "./HubStatus";

const pickSeason = (season: Season | null | undefined) =>
    season && { _id: season._id, name: season.name, start: season.start, end: season.end };

export const GameHubHeader = ({
    game,
    steam,
    tabFlags,
}: {
    game: Game;
    steam: { appId: number; currentPlayers: number } | null;
    tabFlags: HubTabFlags;
}) => {
    const tabs = getHubTabs(game.slug, tabFlags);
    const isCommunity = !game.isOfficial;
    const showStage = game.isComingSoon || !!game.categories?.includes("early-access");

    return (
        <div className="container mx-auto pt-6 md:pt-8">
            <HubBreadcrumbs gameName={game.name} tabs={tabs} />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Mobile: logo + title on one row, status full width below. md+: status under the title */}
                <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-2 md:gap-y-1">
                    {game.logo && (
                        // SanityImage fills its parent, so the wrapper sets the size
                        <div className="h-16 w-24 shrink-0 md:row-span-2 md:h-20 md:w-32">
                            <SanityImage
                                src={game.logo}
                                alt={`${game.name} logo`}
                                width={128}
                                height={80}
                                objectFit="contain"
                            />
                        </div>
                    )}
                    {/* Badges beside the title; wrap under it when the name is long */}
                    <div
                        className={cn(
                            "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 md:self-end",
                            !game.logo && "col-span-2",
                        )}
                    >
                        <HubTitle name={game.name} />
                        {/* One group so the badges wrap together */}
                        {(isCommunity || showStage || steam) && (
                            <div className="flex items-center gap-2">
                                {isCommunity && <CommunityLabel />}
                                {showStage && (
                                    <EarlyAccessChip
                                        gameSlug={game.slug}
                                        isComingSoon={game.isComingSoon}
                                    />
                                )}
                                {steam && (
                                    <SteamPlayersChip
                                        playersCount={steam.currentPlayers}
                                        isComingSoon={
                                            steam.currentPlayers <= 0 && game.isComingSoon
                                        }
                                        appId={steam.appId}
                                        game={game.slug}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                    <div
                        className={cn(
                            "col-span-2 md:self-start",
                            game.logo && "md:col-span-1 md:col-start-2",
                        )}
                    >
                        <HubStatus
                            game={{
                                seasonKeyword: game.seasonKeyword,
                                isDormant: game.isDormant,
                                isComingSoon: game.isComingSoon,
                                currentSeason: pickSeason(game.currentSeason),
                                nextSeason: pickSeason(game.nextSeason),
                            }}
                        />
                    </div>
                </div>
                <HubActions
                    gameSlug={game.slug}
                    gameName={game.name}
                    // Mobile: calendar left, share at the far right of its own row
                    className="justify-between md:justify-start"
                />
            </div>
            <HubTabs tabs={tabs} gameSlug={game.slug} />
        </div>
    );
};
