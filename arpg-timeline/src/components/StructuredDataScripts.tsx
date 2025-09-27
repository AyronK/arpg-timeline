import { Game } from "@/lib/cms/games.types";
import { getStructuredDataForGame } from "@/lib/games/getStructuredDataForGame";

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
    "@graph": unknown[];
};

export const StructuredDataScripts = ({ games }: { games: Game[] }) => {
    const allFaqQuestions: FAQQuestion[] = [];
    const structuredDataArray: StructuredData[] = [];

    games.forEach((game) => {
        const gameData = getStructuredDataForGame(game);
        if (gameData) {
            structuredDataArray.push(gameData.structuredData);
            allFaqQuestions.push(...gameData.faqQuestions);
        }
    });

    const aggregateFaq =
        allFaqQuestions.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "@id": "https://www.arpg-timeline.com/#faq",
                  mainEntity: allFaqQuestions,
              }
            : null;

    return (
        <>
            {structuredDataArray.map((structuredData, index) => (
                <script key={`game-${index}`} type="application/ld+json">
                    {JSON.stringify(structuredData, null, 2)}
                </script>
            ))}
            {aggregateFaq && (
                <script key="aggregate-faq" type="application/ld+json">
                    {JSON.stringify(aggregateFaq, null, 2)}
                </script>
            )}
        </>
    );
};
