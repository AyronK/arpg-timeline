"use client";
import { SeasonWidget } from "@/components/SeasonWidget";
import { Game } from "@/lib/cms/games.types";

import { Content } from "./Content";
import { Selector, SelectorLabels } from "./types";
import { useChip } from "./useChip";

export const EmbedGameToSeasonWidget = ({ game, selector }: { game: Game; selector: Selector }) => {
    const season = selector === "current" ? game.currentSeason : game.nextSeason;
    const chip = useChip({ game, selector });

    if (!season) {
        return null;
    }

    return (
        <SeasonWidget
            aria-label={`${selector} ${game.name} ${game.seasonKeyword} - ${season.name}`}
            chip={chip}
            name={season.name ?? `${SelectorLabels[selector]} ${game.seasonKeyword}`}
        >
            <Content embed game={game} selector={selector} />
        </SeasonWidget>
    );
};
