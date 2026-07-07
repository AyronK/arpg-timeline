import { Game } from "@/lib/cms/games.types";
import { CustomEvent } from "@/types/customEvent";

export const customEventToGame = (event: CustomEvent): Game => ({
    _id: `custom-${event.id}`,
    _updatedAt: event.createdAt,
    _createdAt: event.createdAt,
    name: event.name,
    shortName: event.name,
    isDormant: false,
    isComingSoon: true,
    slug: `custom-${event.id}`,
    seasonKeyword: "Release",
    url: undefined,
    group: undefined,
    logo: undefined as unknown as Game["logo"],
    currentSeason: null,
    nextSeason: {
        _id: `custom-season-${event.id}`,
        _updatedAt: event.createdAt,
        start: {
            startDate: event.startDate,
            confirmed: true,
            timeUnknown: true,
        },
        end: null,
        name: "Release",
    },
    isOfficial: true,
    isCustomEvent: true,
    customEventImageUrl: event.imageUrl,
});
