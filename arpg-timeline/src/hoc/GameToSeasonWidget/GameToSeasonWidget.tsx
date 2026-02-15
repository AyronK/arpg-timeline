"use client";

import { SeasonWidget } from "@/components/SeasonWidget";
import { Game } from "@/lib/cms/games.types";

import { Content } from "./Content";
import { SeoText } from "./SeoText";
import { Selector, SelectorLabels } from "./types";
import { useChip } from "./useChip";

export const GameToSeasonWidget = ({ game, selector }: { game: Game; selector: Selector }) => {
    const season = selector === "current" ? game.currentSeason : game.nextSeason;
    const chip = useChip({ game, selector });

    if (!season) {
        return null;
    }

    return (
        <SeasonWidget
            aria-label={`${selector} ${game.name} ${game.seasonKeyword} - ${season.name}`}
            chip={chip}
            isOfficial={game.isOfficial}
            name={season.name ?? `${SelectorLabels[selector]} ${game.seasonKeyword}`}
            url={season.url ?? undefined}
        >
            <div className="sr-only">
                <SeoText game={game} selector={selector} />
            </div>
            <Content game={game} selector={selector} />
        </SeasonWidget>
    );
};
