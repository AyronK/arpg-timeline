import { Game } from "@/lib/cms/games.types";

export const getStructuredDataForGame = (game: Game) => {
    if (!game || !game.currentSeason || !game.nextSeason) return null;

    const seasons = [];

    if (
        game.currentSeason &&
        !!game.currentSeason.start?.confirmed &&
        !!game.currentSeason.start?.startDate &&
        !!game.currentSeason.end?.endDate
    ) {
        seasons.push({
            "@type": "Event",
            name: game.currentSeason.name || "Current Season",
            startDate: game.currentSeason.start?.confirmed
                ? game.currentSeason.start?.startDate || null
                : null,
            endDate: game.currentSeason.end?.confirmed
                ? game.currentSeason.end?.endDate || null
                : null,
            eventStatus: game.currentSeason.start?.confirmed
                ? "https://schema.org/EventScheduled"
                : null,
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: { "@type": "VirtualLocation", url: game.url || null },
        });
    }

    if (
        game.nextSeason &&
        !!game.nextSeason.start?.confirmed &&
        !!game.nextSeason.start?.startDate &&
        !!game.nextSeason.end?.endDate
    ) {
        seasons.push({
            "@type": "Event",
            name: game.nextSeason.name || "Next Season",
            startDate: game.nextSeason.start?.confirmed
                ? game.nextSeason.start?.startDate || null
                : null,
            endDate: game.nextSeason.end?.confirmed ? game.nextSeason.end?.endDate || null : null,
            eventStatus: game.nextSeason.start?.confirmed
                ? "https://schema.org/EventScheduled"
                : null,
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: { "@type": "VirtualLocation", url: game.url || null },
        });
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: game.name,
        url: game.url || null,
        genre: "Action RPG",
        seasons: seasons,
    };

    return structuredData;
};
