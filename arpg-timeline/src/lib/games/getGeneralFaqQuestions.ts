import { Game } from "@/lib/cms/games.types";

type FAQQuestion = {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
        "@type": "Answer";
        text: string;
    };
};

export const getGeneralFaqQuestions = (games: Game[]): FAQQuestion[] => {
    const questions: FAQQuestion[] = [];

    const comingSoonGames = games.filter((g) => g.isComingSoon);

    if (comingSoonGames.length > 0) {
        const list = comingSoonGames.map((g) => g.name).join(", ");

        questions.push({
            "@type": "Question",
            name: "What upcoming aRPGs are coming soon?",
            acceptedAnswer: {
                "@type": "Answer",
                text: `Upcoming aRPGs currently tracked on aRPG Timeline include: ${list}. Follow their release dates and season countdowns at arpg-timeline.com.`,
            },
        });
    }

    return questions;
};
