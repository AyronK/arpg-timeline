import { Suspense } from "react";

import { Game, GameStream } from "@/lib/cms/games.types";

import { GamesAndEventsGrid, GamesAndEventsGridFallback } from "./GamesAndEventsGrid";
import { Streams, StreamsFallback } from "./Streams";

export const Main = ({ games, streams }: { games: Game[]; streams: GameStream[] }) => {
    return (
        <div className="mt-4 flex flex-col gap-4 xl:mt-8">
            <Suspense fallback={<StreamsFallback streams={streams} />}>
                <Streams games={games} streams={streams} />
            </Suspense>
            <div className="relative flex flex-col gap-4">
                <Suspense fallback={<GamesAndEventsGridFallback games={games} />}>
                    <GamesAndEventsGrid games={games} />
                </Suspense>
            </div>
        </div>
    );
};
