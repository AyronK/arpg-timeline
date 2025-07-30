import { Suspense } from "react";

import { GameFiltersContextProvider } from "@/hooks/dashboardConfig/useFilteredGames";
import { Game, GameStream } from "@/lib/cms/games.types";

import { GamesAndEventsGrid, GamesAndEventsGridFallback } from "./GamesAndEventsGrid";
import { Streams, StreamsFallback } from "./Streams";

export const Main = ({ games, streams }: { games: Game[]; streams: GameStream[] }) => {
    return (
        <GameFiltersContextProvider games={games}>
            <div className="mt-4 flex flex-col gap-4 xl:mt-8">
                <Suspense fallback={<StreamsFallback streams={streams} />}>
                    <Streams streams={streams} />
                </Suspense>
                <div className="relative flex flex-col gap-4">
                    <Suspense fallback={<GamesAndEventsGridFallback games={games} />}>
                        <GamesAndEventsGrid />
                    </Suspense>
                </div>
            </div>
        </GameFiltersContextProvider>
    );
};
