import { Game } from "@/lib/cms/games.types";

export const getStructuredDataForGame = (game: Game) => {
  if (!game) return null;

  type Article = {
    "@type": "NewsArticle";
    "@id": string;
    headline: string;
    description: string;
    mainEntityOfPage: {
      "@type": "WebPage";
      "@id": string;
    };
    url: string;
    datePublished: string;
    dateModified: string;
    author: {
      "@type": "Organization";
      name: string;
      url: string;
    };
    publisher: {
      "@type": "Organization";
      name: string;
      logo: {
        "@type": "ImageObject";
        url: string;
      };
    };
    image: {
      "@type": "ImageObject";
      url: string;
    };
  };

  const articles: Article[] = [];

  const buildArticle = (
    season: Game["currentSeason"] | Game["nextSeason"],
    label: string
  ): Article | null => {
    if (!season) return null;
    if (!season.start?.confirmed || !season.start.startDate) return null;

    const seasonName = season.name || label;
    const gameUrl = `https://www.arpg-timeline.com/game/${game.slug}`;
    const now = new Date().toISOString();

    return {
      "@type": "NewsArticle",
      "@id": `${gameUrl}#${label.toLowerCase()}-season`,
      headline: `${game.name} - ${seasonName}`,
      description: `${label} ${game.seasonKeyword.toLowerCase()} of ${game.name}. Starts on ${season.start.startDate}.`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": gameUrl
      },
      url: gameUrl,
      datePublished: now,
      dateModified: now,
      author: {
        "@type": "Organization",
        name: "aRPG Timeline",
        url: "https://www.arpg-timeline.com"
      },
      publisher: {
        "@type": "Organization",
        name: "aRPG Timeline",
        logo: {
          "@type": "ImageObject",
          url: "https://www.arpg-timeline.com/assets/seoimage.png"
        }
      },
      image: {
        "@type": "ImageObject",
        url: game.logo?.url || ""
      }
    };
  };

  const current = buildArticle(game.currentSeason, "Current");
  const next = buildArticle(game.nextSeason, "Next");
  if (current) articles.push(current);
  if (next) articles.push(next);

  const faq = game.nextSeason && game.nextSeason.start?.startDate && game.nextSeason.start.confirmed ? {
    "@type": "FAQPage",
    "@id": `https://www.arpg-timeline.com/game/${game.slug}#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `When is the next ${game.name} ${game.seasonKeyword}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The next ${game.seasonKeyword.toLowerCase()} starts on ${game.nextSeason.start.startDate}.`
        }
      }
    ]
  } : null;

  const graph = [
    {
      "@type": ["SoftwareApplication", "VideoGame"],
      "@id": `https://www.arpg-timeline.com/game/${game.slug}#game`,
      name: game.name,
      url: `https://www.arpg-timeline.com/game/${game.slug}`,
      applicationCategory: "GameApplication",
      operatingSystem: "Windows",
      image: {
        "@type": "ImageObject",
        url: game.logo?.url || ""
      }
    },
    ...articles
  ];

  if (faq) graph.push(faq);

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
};




