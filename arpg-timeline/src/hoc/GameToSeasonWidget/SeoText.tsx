import { Game } from "@/lib/cms/games.types";

import { NextSeasonStartSeoText } from "../NextSeasonStartSeoText";
import { PreviousSeasonEndingSeoText } from "../PreviousSeasonEndingSeoText";
import { PreviousSeasonStartedSeoText } from "../PreviousSeasonStartedSeoText";
import { Selector } from "./types";

export const SeoText = ({ game, selector }: { game: Game; selector: Selector }) => {
    const season = selector === "current" ? game.currentSeason : game.nextSeason;

    if (!season) {
        return null;
    }

    if (selector === "next") {
        return (
            <>
                <NextSeasonStartSeoText
                    gameName={game.name}
                    seasonName={season.name!}
                    start={season.start!}
                    seasonKeyword={game.seasonKeyword}
                />
                <NextSeasonStartSeoText
                    gameName={game.shortName!}
                    seasonName={season.name!}
                    start={season.start!}
                    seasonKeyword={game.seasonKeyword}
                />
            </>
        );
    } else if (season.start?.startDate) {
        return (
            season.start?.startDate && (
                <>
                    <PreviousSeasonStartedSeoText
                        gameName={game.name}
                        seasonName={season.name!}
                        startDate={season.start.startDate}
                        seasonKeyword={game.seasonKeyword}
                    />
                    <PreviousSeasonStartedSeoText
                        gameName={game.shortName!}
                        seasonName={season.name!}
                        startDate={season.start.startDate}
                        seasonKeyword={game.seasonKeyword}
                    />
                    <PreviousSeasonEndingSeoText
                        gameName={game.name}
                        seasonName={season.name!}
                        end={season.end!}
                        seasonKeyword={game.seasonKeyword}
                    />
                    <PreviousSeasonEndingSeoText
                        gameName={game.shortName!}
                        seasonName={season.name!}
                        end={season.end!}
                        seasonKeyword={game.seasonKeyword}
                    />
                </>
            )
        );
    }
};
