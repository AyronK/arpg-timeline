import { Suspense } from "react";

import { Game, GameStatistics, GameStream } from "@/lib/cms/games.types";

import { GamesAndEventsGrid, GamesAndEventsGridFallback } from "./GamesAndEventsGrid";
import { Streams, StreamsFallback } from "./Streams";

export const Main = ({
    games,
    streams,
    statistics,
}: {
    games: Game[];
    streams: GameStream[];
    statistics: Record<string, GameStatistics>;
}) => {
    return (
        <div className="mt-4 flex flex-col gap-4 xl:mt-8">
            <Suspense fallback={<StreamsFallback streams={streams} />}>
                <Streams games={games} streams={streams} />
            </Suspense>
            <div className="relative flex flex-col gap-4">
                <Suspense fallback={<GamesAndEventsGridFallback games={games} />}>
                    <GamesAndEventsGrid games={games} statistics={statistics}/>
                </Suspense>
            </div>
        </div>
    );
};
