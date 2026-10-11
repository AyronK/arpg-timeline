import { SanityImage } from "@/components/SanityImage";
import { SteamPlayersChip } from "@/components/SteamPlayersChip";
import { Game, Season } from "@/lib/cms/games.types";

import { getHubTabs } from "../../hub";
import { HubActions } from "./HubActions";
import { HubBreadcrumbs, HubTabs, HubTitle } from "./HubNav";
import { HubStatus } from "./HubStatus";

const pickSeason = (season: Season | null | undefined) =>
    season && { _id: season._id, name: season.name, start: season.start, end: season.end };

export const GameHubHeader = ({
    game,
    steam,
    hasGuides,
}: {
    game: Game;
    steam: { appId: number; currentPlayers: number } | null;
    hasGuides: boolean;
}) => {
    const tabs = getHubTabs(game, { hasGuides });

    return (
        <div className="container mx-auto pt-6 md:pt-8">
            <HubBreadcrumbs gameName={game.name} tabs={tabs} />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                    {game.logo && (
                        // SanityImage fills its parent, so the wrapper sets the size
                        <div className="h-16 w-24 shrink-0 md:h-20 md:w-32">
                            <SanityImage
                                src={game.logo}
                                alt={`${game.name} logo`}
                                width={128}
                                height={80}
                                objectFit="contain"
                            />
                        </div>
                    )}
                    <div className="min-w-0">
                        <HubTitle name={game.name} />
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <HubStatus
                                game={{
                                    seasonKeyword: game.seasonKeyword,
                                    isDormant: game.isDormant,
                                    isComingSoon: game.isComingSoon,
                                    currentSeason: pickSeason(game.currentSeason),
                                    nextSeason: pickSeason(game.nextSeason),
                                }}
                            />
                            {steam && (
                                <SteamPlayersChip
                                    playersCount={steam.currentPlayers}
                                    isComingSoon={steam.currentPlayers <= 0 && game.isComingSoon}
                                    appId={steam.appId}
                                    game={game.slug}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <HubActions gameSlug={game.slug} gameName={game.name} />
            </div>
            <HubTabs tabs={tabs} gameSlug={game.slug} />
        </div>
    );
};
