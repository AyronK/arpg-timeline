import { Game, GameStream } from "@/lib/cms/games.types";

import { GamesAndEventsGrid } from "./GamesAndEventsGrid";
import { Streams } from "./Streams";

export const Main = ({ games, streams }: { games: Game[]; streams: GameStream[] }) => {
    return (
        <div className="mt-4 flex flex-col gap-4 xl:mt-8">
            <Streams games={games} streams={streams} />
            <div className="relative flex flex-col gap-4">
                <GamesAndEventsGrid games={games} />
            </div>
        </div>
    );
};
