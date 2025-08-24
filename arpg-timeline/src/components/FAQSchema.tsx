import { Faq, faqQuery, FaqQueryResult } from "@/lib/cms/queries/faqQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

export const FAQSchema = async () => {
    try {
        const faqData: FaqQueryResult = await sanityFetch({
            query: faqQuery,
            revalidate: 30 * 24 * 60 * 60,
            tags: ["faq"],
        });

        if (!faqData || !faqData.faq || faqData.faq.length === 0) {
            return null;
        }

        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.faq.map((item: Faq) => ({
                "@type": "Question",
                name: item.title,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: item.content
                        .filter((block) => block._type === "block")
                        .map((block) => block.children?.map((child) => child.text).join(" ") || "")
                        .join(" ")
                        .trim(),
                },
            })),
        };

        return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
    } catch (error) {
        console.error("Error fetching FAQ data for schema:", error);
        return null;
    }
};
