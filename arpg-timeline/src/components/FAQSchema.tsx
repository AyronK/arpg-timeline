import { Faq, faqQuery, FaqQueryResult } from "@/lib/cms/queries/faqQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

export const FAQSchema = async () => {
    let schema: {
        "@context": string;
        "@type": string;
        mainEntity: Array<{
            "@type": string;
            name: string;
            acceptedAnswer: {
                "@type": string;
                text: string;
            };
        }>;
    } | null = null;

    try {
        const faqData: FaqQueryResult = await sanityFetch({
            query: faqQuery,
            revalidate: 30 * 24 * 60 * 60,
            tags: ["faq"],
        });

        if (faqData && faqData.faq && faqData.faq.length > 0) {
            schema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqData.faq.map((item: Faq) => ({
                    "@type": "Question",
                    name: item.title,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: item.content
                            .filter((block) => block._type === "block")
                            .map(
                                (block) =>
                                    block.children?.map((child) => child.text).join(" ") || "",
                            )
                            .join(" ")
                            .trim(),
                    },
                })),
            };
        }
    } catch (error) {
        console.error("Error fetching FAQ data for schema:", error);
    }

    if (!schema) {
        return null;
    }

    return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
};
