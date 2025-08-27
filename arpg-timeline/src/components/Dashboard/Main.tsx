import { Suspense } from "react";

import { Game, GameStatistics, GameStream } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";

import { GamesAndEventsGrid, GamesAndEventsGridFallback } from "./GamesAndEventsGrid";
import { Streams, StreamsFallback } from "./Streams";

export const Main = ({
    games,
    streams,
    statistics,
    category = "featured",
}: {
    games: Game[];
    streams: GameStream[];
    statistics: Record<string, GameStatistics>;
    category?: GameFilterCategory;
}) => {
    return (
        <div className="mt-2 flex flex-col">
            <Suspense fallback={<StreamsFallback streams={streams} />}>
                <Streams games={games} streams={streams} />
            </Suspense>
            <div className="relative flex flex-col gap-4">
                <Suspense fallback={<GamesAndEventsGridFallback games={games} />}>
                    <GamesAndEventsGrid games={games} statistics={statistics} category={category} />
                </Suspense>
            </div>
        </div>
    );
};
