import { Game } from "@/lib/cms/games.types";

export const getStructuredDataForGame = (game: Game) => {
    if (!game) return null;
    
    const structuredData = [];
    
    const gameStructuredData = {
        "@context": "https://schema.org",
        "@type": ["VideoGame", "SoftwareApplication"],
        name: game.name,
        description: `${game.name} - ${game.currentSeason ? ` currently in ${game.currentSeason.name} ${game.seasonKeyword}` : ''}`,
        applicationCategory: "GameApplication",
        genre: "Action RPG",
        ...(game.url && { url: game.url }),
        ...(game.logo && {
            image: game.logo.url || `${game.logo._ref ? `https://cdn.sanity.io/images/your-project-id/production/${game.logo._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}` : ''}`
        }),
    };
    
    structuredData.push(gameStructuredData);
    
    if (
        game.currentSeason &&
        game.currentSeason.start?.confirmed &&
        game.currentSeason.start?.startDate &&
        game.currentSeason.end?.endDate
    ) {
        const currentSeasonName = game.currentSeason.name || `Current ${game.seasonKeyword}`;
        structuredData.push({
            "@context": "https://schema.org",
            "@type": "CreativeWorkSeason",
            name: currentSeasonName,
            partOfSeries: {
                "@type": "CreativeWorkSeries",
                name: game.name
            },
            description: `Current ${game.seasonKeyword} of ${game.name}`,
            startDate: game.currentSeason.start.startDate,
            endDate: game.currentSeason.end.endDate,
            ...(game.currentSeason.url && { url: game.currentSeason.url }),
            ...(game.currentSeason.patchNotesUrl && {
                mainEntity: {
                    "@type": "WebPage",
                    name: "Patch Notes",
                    url: game.currentSeason.patchNotesUrl
                }
            }),
        });
    }
    
    if (
        game.nextSeason &&
        game.nextSeason.start?.confirmed &&
        game.nextSeason.start?.startDate &&
        game.nextSeason.end?.endDate
    ) {
        const nextSeasonName = game.nextSeason.name || `Next ${game.seasonKeyword}`;
        structuredData.push({
            "@context": "https://schema.org",
            "@type": "CreativeWorkSeason",
            name: nextSeasonName,
            partOfSeries: {
                "@type": "CreativeWorkSeries",
                name: game.name
            },
            description: `Upcoming ${game.seasonKeyword} of ${game.name}`,
            startDate: game.nextSeason.start.startDate,
            endDate: game.nextSeason.end.endDate,
            ...(game.nextSeason.url && { url: game.nextSeason.url }),
            ...(game.nextSeason.patchNotesUrl && {
                mainEntity: {
                    "@type": "WebPage",
                    name: "Patch Notes",
                    url: game.nextSeason.patchNotesUrl
                }
            }),
        });
    }
    
    return structuredData.length > 0 ? structuredData : null;
};


