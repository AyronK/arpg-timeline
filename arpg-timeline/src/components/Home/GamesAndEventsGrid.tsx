"use client";

import { GameFilters } from "@/components/GameFilters";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { Game } from "@/lib/cms/games.types";

import { Events } from "./Events";
import { Games } from "./Games";

export const GamesAndEventsGrid = ({ games }: { games: Game[] }) => {
    const { filteredGames, ...filtersProps } = useGameFilters(games);
    const events = useTimelineEvents(filteredGames);
    return (
        <article className="3xl:grid-cols-4 4xl:grid-cols-5 relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <GameFilters {...filtersProps} />
            <Games games={games} />
            <Events events={events} />
        </article>
    );
};
