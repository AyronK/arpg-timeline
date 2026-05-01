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
    const gameUrl = `https://www.arpg-timeline.com/game/${game.slug}`;
    const seasonKeyword = game.seasonKeyword.toLowerCase();

    if (game.currentSeason?.name) {
        const currentName = game.currentSeason.name;
        const startedOn = game.currentSeason.start?.startDate
            ? ` It started on ${game.currentSeason.start.startDate}.`
            : "";

        gameFaqQuestions.push({
            "@type": "Question",
            name: `What is the current ${game.name} ${game.seasonKeyword}?`,
            acceptedAnswer: {
                "@type": "Answer",
                text: `The current ${game.name} ${seasonKeyword} is ${currentName}.${startedOn}`,
            },
        });

        if (game.shortName) {
            gameFaqQuestions.push({
                "@type": "Question",
                name: `What is the current ${game.shortName} ${game.seasonKeyword}?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The current ${game.shortName} (${game.name}) ${seasonKeyword} is ${currentName}.${startedOn}`,
                },
            });
        }
    }

    if (game.nextSeason && game.nextSeason.start?.startDate && game.nextSeason.start.confirmed) {
        const nextName = game.nextSeason.name;
        const nextDate = game.nextSeason.start.startDate;
        const isFuture = new Date(nextDate) > new Date();

        gameFaqQuestions.push({
            "@type": "Question",
            name: `When is the next ${game.name} ${game.seasonKeyword}?`,
            acceptedAnswer: {
                "@type": "Answer",
                text: `The next ${game.name} ${seasonKeyword}, ${nextName}, starts on ${nextDate}.`,
            },
        });

        if (game.shortName) {
            gameFaqQuestions.push({
                "@type": "Question",
                name: `When is ${game.shortName} next ${game.seasonKeyword}?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The next ${game.shortName} (${game.name}) ${seasonKeyword}, ${nextName}, starts on ${nextDate}.`,
                },
            });
        }

        gameFaqQuestions.push({
            "@type": "Question",
            name: `What is the next ${game.name} ${game.seasonKeyword} called?`,
            acceptedAnswer: {
                "@type": "Answer",
                text: `The next ${game.name} ${seasonKeyword} is called ${nextName}. It starts on ${nextDate}.`,
            },
        });

        if (isFuture) {
            gameFaqQuestions.push({
                "@type": "Question",
                name: `Is ${nextName} out yet?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `No, ${nextName} has not started yet. It launches on ${nextDate}. Track the countdown at ${gameUrl}.`,
                },
            });
        }
    }

    if (game.currentSeason && game.currentSeason.end?.endDate) {
        const endDate = game.currentSeason.end.endDate;
        const ended = new Date(endDate) < new Date();
        const seasonLabel = ended ? "previous" : "current";
        const endVerb = ended ? "concluded on" : "ends on";
        const questionVerb = ended ? "did" : "does";
        const currentName = game.currentSeason.name;

        gameFaqQuestions.push({
            "@type": "Question",
            name: `When ${questionVerb} the ${seasonLabel} ${game.name} ${game.seasonKeyword} end?`,
            acceptedAnswer: {
                "@type": "Answer",
                text: `The ${seasonLabel} ${game.name} ${seasonKeyword}, ${currentName}, ${endVerb} ${endDate}.`,
            },
        });

        if (game.shortName) {
            gameFaqQuestions.push({
                "@type": "Question",
                name: `When ${questionVerb} ${game.shortName} ${game.seasonKeyword} end?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The ${seasonLabel} ${game.shortName} (${game.name}) ${seasonKeyword}, ${currentName}, ${endVerb} ${endDate}.`,
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
