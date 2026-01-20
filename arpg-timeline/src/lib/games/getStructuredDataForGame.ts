import { Game } from "@/lib/cms/games.types";

type SoftwareApplicationNode = {
    "@type": ["SoftwareApplication", "VideoGame"];
    "@id": string;
    name: string;
    alternateName?: string;
    url: string;
    applicationCategory: string;
    operatingSystem: string;
    image: {
        "@type": "ImageObject";
        url: string;
    };
};

type NewsArticleNode = {
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

type FAQQuestion = {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
        "@type": "Answer";
        text: string;
    };
};

type StructuredData = {
    "@context": "https://schema.org";
    "@graph": (SoftwareApplicationNode | NewsArticleNode)[];
};

type GameStructuredData = {
    structuredData: StructuredData;
    faqQuestions: FAQQuestion[];
};

export const getStructuredDataForGame = (game: Game): GameStructuredData | null => {
    if (!game) return null;

    const articles: NewsArticleNode[] = [];

    const buildArticle = (
        season: Game["currentSeason"] | Game["nextSeason"],
        label: string,
    ): NewsArticleNode | null => {
        if (!season || !season.start?.confirmed || !season.start.startDate) return null;

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
                "@id": gameUrl,
            },
            url: gameUrl,
            datePublished: now,
            dateModified: now,
            author: {
                "@type": "Organization",
                name: "aRPG Timeline",
                url: "https://www.arpg-timeline.com",
            },
            publisher: {
                "@type": "Organization",
                name: "aRPG Timeline",
                logo: {
                    "@type": "ImageObject",
                    url: "https://www.arpg-timeline.com/assets/seoimage.png",
                },
            },
            image: {
                "@type": "ImageObject",
                url: game.logo?.url || "",
            },
        };
    };

    const current = buildArticle(game.currentSeason, "Current");
    const next = buildArticle(game.nextSeason, "Next");
    if (current) articles.push(current);
    if (next) articles.push(next);

    const gameFaqQuestions: FAQQuestion[] = [];

    if (game.nextSeason && game.nextSeason.start?.startDate && game.nextSeason.start.confirmed) {
        gameFaqQuestions.push({
            "@type": "Question",
            name: `When is the next ${game.name} ${game.seasonKeyword}?`,
            acceptedAnswer: {
                "@type": "Answer",
                text: `The next ${game.name} ${game.seasonKeyword.toLowerCase()}, ${game.nextSeason.name}, starts on ${game.nextSeason.start.startDate}.`,
            },
        });

        if (game.shortName) {
            gameFaqQuestions.push({
                "@type": "Question",
                name: `When is ${game.shortName} next ${game.seasonKeyword}?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The next ${game.shortName} (${game.name}) ${game.seasonKeyword.toLowerCase()}, ${game.nextSeason.name}, starts on ${game.nextSeason.start.startDate}.`,
                },
            });
        }
    }

    if (game.currentSeason && game.currentSeason.end?.endDate && game.currentSeason.end.confirmed) {
        gameFaqQuestions.push({
            "@type": "Question",
            name: `When does the current ${game.name} ${game.seasonKeyword} end?`,
            acceptedAnswer: {
                "@type": "Answer",
                text: `The current ${game.name} ${game.seasonKeyword.toLowerCase()}, ${game.currentSeason.name}, ends on ${game.currentSeason.end.endDate}.`,
            },
        });

        if (game.shortName) {
            gameFaqQuestions.push({
                "@type": "Question",
                name: `When does ${game.shortName} ${game.seasonKeyword} end?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The current ${game.shortName} (${game.name}) ${game.seasonKeyword.toLowerCase()}, ${game.currentSeason.name}, ends on ${game.currentSeason.end.endDate}.`,
                },
            });
        }
    }

    const gameNode: SoftwareApplicationNode = {
        "@type": ["SoftwareApplication", "VideoGame"],
        "@id": `https://www.arpg-timeline.com/game/${game.slug}#game`,
        name: game.name,
        url: `https://www.arpg-timeline.com/game/${game.slug}`,
        applicationCategory: "GameApplication",
        operatingSystem: "Windows",
        image: {
            "@type": "ImageObject",
            url: game.logo?.url || "",
        },
    };

    if (game.shortName) {
        gameNode.alternateName = game.shortName;
    }

    const graph: StructuredData["@graph"] = [gameNode, ...articles];

    return {
        structuredData: {
            "@context": "https://schema.org",
            "@graph": graph,
        },
        faqQuestions: gameFaqQuestions,
    };
};
