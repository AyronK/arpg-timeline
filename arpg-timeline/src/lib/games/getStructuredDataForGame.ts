import { Game } from "@/lib/cms/games.types";

export const getStructuredDataForGame = (game: Game) => {
    if (!game) return null;

    const structuredData = [];

    if (
        game.currentSeason &&
        game.currentSeason.start?.confirmed &&
        game.currentSeason.start?.startDate &&
        game.currentSeason.end?.endDate
    ) {
        const currentSeasonName = game.currentSeason.name || `Current ${game.seasonKeyword}`;
        structuredData.push({
            "@context": "https://schema.org",
            "@type": "Event",
            name: `${game.name} - ${currentSeasonName}`,
            description: `Current ${game.seasonKeyword.toLowerCase()} of ${game.name}`,
            startDate: game.currentSeason.start.startDate,
            endDate: game.currentSeason.end.endDate,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: {
                "@type": "VirtualLocation",
                name: game.name,
                url: game.url || game.currentSeason.url,
            },
            ...(game.currentSeason.url && { url: game.currentSeason.url }),
        });
    }

    // Add next season as Event
    if (
        game.nextSeason &&
        game.nextSeason.start?.confirmed &&
        game.nextSeason.start?.startDate &&
        game.nextSeason.end?.endDate
    ) {
        const nextSeasonName = game.nextSeason.name || `Next ${game.seasonKeyword}`;
        structuredData.push({
            "@context": "https://schema.org",
            "@type": "Event",
            name: `${game.name} - ${nextSeasonName}`,
            description: `Next ${game.seasonKeyword.toLowerCase()} of ${game.name}`,
            startDate: game.nextSeason.start.startDate,
            endDate: game.nextSeason.end.endDate,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: {
                "@type": "VirtualLocation",
                name: game.name,
                url: game.url || game.nextSeason.url,
            },
            ...(game.nextSeason.url && { url: game.nextSeason.url }),
        });
    }

    return structuredData.length > 0 ? structuredData : null;
};
