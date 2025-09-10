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
        structuredData.push({
            "@context": "https://schema.org",
            "@type": "Event",
            name: game.currentSeason.name || "Current Season",
            startDate: game.currentSeason.start.startDate,
            endDate: game.currentSeason.end.endDate,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: {
                "@type": "VirtualLocation",
                name: game.name,
                url: game.url
            }
        });
    }
    
    if (
        game.nextSeason &&
        game.nextSeason.start?.confirmed &&
        game.nextSeason.start?.startDate &&
        game.nextSeason.end?.endDate
    ) {
        structuredData.push({
            "@context": "https://schema.org",
            "@type": "Event",
            name: game.nextSeason.name || "Next Season",
            startDate: game.nextSeason.start.startDate,
            endDate: game.nextSeason.end.endDate,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: {
                "@type": "VirtualLocation",
                name: game.name,
                url: game.url
            }
        });
    }
    
    return structuredData.length > 0 ? structuredData : null;
};
