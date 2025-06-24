"use client";

import { GameFilters } from "@/components/GameFilters";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { Game } from "@/lib/cms/games.types";

import ClientOnlyVisibleWrapper from "../ClientOnlyVisibleWrapper";
import { Events } from "./Events";
import { Games } from "./Games";

export const GamesAndEventsGrid = ({ games }: { games: Game[] }) => {
    const { filteredGames, ...filtersProps } = useGameFilters(games);
    const events = useTimelineEvents(filteredGames);
    const activeGames = filteredGames.filter((g) => !g.isDormant && !g.isComingSoon);
    const comingSoonGames = filteredGames.filter((g) => g.isComingSoon);
    const dormantGames = filteredGames
        .filter((g) => g.isDormant)
        .map((g) => ({ ...g, nextSeason: null }));

    return (
        <>
            <article>
                <h2 className="sr-only">Seasons</h2>
                <div className="3xl:grid-cols-4 4xl:grid-cols-5 relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
                    <GameFilters {...filtersProps} />
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
