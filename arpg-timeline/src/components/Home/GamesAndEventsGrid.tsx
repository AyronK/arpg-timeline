"use client";

import { GameFilters } from "@/components/GameFilters";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { Game } from "@/lib/cms/games.types";
import { DashboardConfigCompressor } from "@/lib/config/DashboardConfigCompressor";
import { useDashboardConfiguration } from "@/lib/config/DashboardConfigurationProvider";
import { useFilteredGames } from "@/lib/config/filters/GameFiltersContext";
import { Button } from "@/ui/Button";

import ClientOnlyVisibleWrapper from "../ClientOnlyVisibleWrapper";
import { Events } from "./Events";
import { Games } from "./Games";

export const GamesAndEventsGrid = () => {
    const [dashboardConfig] = useDashboardConfiguration();

    const filteredGames = useFilteredGames();
    const events = useTimelineEvents(filteredGames);
    const activeGames = filteredGames.filter((g) => !g.isDormant && !g.isComingSoon);
    const comingSoonGames = filteredGames.filter((g) => g.isComingSoon);
    const dormantGames = filteredGames
        .filter((g) => g.isDormant)
        .map((g) => ({ ...g, nextSeason: null }));

    return (
        <>
            <article>
                <Button
                    onClick={async () => {
                        const compressed = await new DashboardConfigCompressor().compress(
                            dashboardConfig,
                        );
                        console.log("Compressed", {
                            compressed,
                            length: compressed.length,
                            uncompressed: JSON.stringify(dashboardConfig).length,
                        });

                        const decompressed = await new DashboardConfigCompressor().decompress(
                            compressed,
                        );

                        console.log("Decompressed", { decompressed });
                    }}
                >
                    Export
                </Button>
                <h2 className="sr-only">Seasons</h2>
                <div className="3xl:grid-cols-4 4xl:grid-cols-5 relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
                    <GameFilters />
                    <Games games={[...activeGames, ...comingSoonGames, ...dormantGames]} />
                    <Events events={events} />
                </div>
            </article>
        </>
    );
};

// TODO refactor
export const GamesAndEventsGridFallback = ({ games }: { games: Game[] }) => {
    const events = useTimelineEvents(games);
    return (
        <ClientOnlyVisibleWrapper>
            <article className="3xl:grid-cols-4 4xl:grid-cols-5 relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
                <h2 className="sr-only">Seasons</h2>
                <Games games={games} />
                <Events events={events} />
            </article>
        </ClientOnlyVisibleWrapper>
    );
};
