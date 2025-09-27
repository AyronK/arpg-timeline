import { Game } from "@/lib/cms/games.types";

export const getStructuredDataForGame = (game: Game) => {
  if (!game) return null;

  const events = [];

  const buildEvent = (
    season: Game["currentSeason"] | Game["nextSeason"],
    label: string
  ) => {
    if (!season) return null;
    if (!season.start?.confirmed || !season.start.startDate) {
      return null;
    }

    const seasonName = season.name || label;

    const startDate = new Date(season.start.startDate);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    return {
      "@type": "Event",
      "@id": `${game.url}#${label.toLowerCase()}-season`,
      name: `${game.name} - ${seasonName}`,
      description: `${label} ${game.seasonKeyword.toLowerCase()} of ${game.name}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      location: {
        "@type": "VirtualLocation",
        url: season.url || game.url,
        name: game.name,
      },
      organizer: {
        "@type": "Organization",
        name: "aRPG Timeline",
        url: "https://www.arpg-timeline.com",
      },
      offers: {
        "@type": "Offer",
        url: season.url || game.url,
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      url: season.url || game.url,
      about: {
        "@id": `${game.url}#game`
      }
    };
  };

  const current = buildEvent(game.currentSeason, "Current");
  const next = buildEvent(game.nextSeason, "Next");
  if (current) events.push(current);
  if (next) events.push(next);

  if (!events.length) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["SoftwareApplication", "VideoGame"],
        "@id": `${game.url}#game`,
        name: game.name,
        url: game.url || "",
        applicationCategory: "GameApplication",
        operatingSystem: "Windows",
      },
      ...events,
    ],
  };

  return structuredData;
};

