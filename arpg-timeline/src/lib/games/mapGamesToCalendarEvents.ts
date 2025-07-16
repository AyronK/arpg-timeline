import { Event as CalendarEvent } from "react-big-calendar";

import { Game } from "../cms/games.types";

export type Event = CalendarEvent & {
    game: Game;
};

export function mapGamesToCalendarEvents(games: Game[]): Event[] {
    return games.flatMap((game) => {
        const events: Event[] = [];

        const addSeasonEvent = (
            season: Game["currentSeason"] | Game["nextSeason"],
            label: string,
        ) => {
            if (season?.start?.startDate && season.start.confirmed) {
                events.push({
                    title: season.name ?? label,
                    game: game,
                    start: new Date(season.start.startDate),
                    end: new Date(season.start.startDate),
                    resource: {
                        gameSlug: game.slug,
                        seasonUrl: season.url,
                    },
                });
            }
        };

        addSeasonEvent(game.nextSeason, "Next Season");

        return events;
    });
}
