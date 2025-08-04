"use client";
import { useMemo } from "react";

import { SeasonChip } from "@/components/SeasonWidget";
import { Game } from "@/lib/cms/games.types";
import { inGracePeriod, isOver } from "@/lib/games/sortBySeasons";

import { Selector } from "./types";

export const useChip = ({ game, selector }: { game: Game; selector: Selector }) => {
    return useMemo(() => {
        const season = selector === "current" ? game.currentSeason : game.nextSeason;

        if (!season) {
            return "over";
        }

        const isInGracePeriod = inGracePeriod(season.start?.startDate);
        let chip: SeasonChip;

        if (game.isDormant) {
            chip = "dormant";
        } else if (selector === "next") {
            chip = game.isComingSoon ? "comingSoon" : "next";
        } else if (isInGracePeriod) {
            chip = "live";
        } else if (season.end?.confirmed && isOver(season.end.endDate)) {
            chip = "over";
        } else {
            chip = "now";
        }

        return chip;
    }, [game.currentSeason, game.isComingSoon, game.isDormant, game.nextSeason, selector]);
};
