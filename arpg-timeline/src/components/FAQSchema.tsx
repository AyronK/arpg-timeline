import { Faq } from "@/lib/cms/queries/faqQuery";
import { sanityClient } from "@/lib/sanity/sanityClient";

const faqQuery = `*[_type == "faq"] | order(order asc) {
  title,
  content
}`;

export const FAQSchema = async () => {
    try {
        const faqData: Faq[] = await sanityClient.fetch(faqQuery);

        if (!faqData || faqData.length === 0) {
            return null;
        }

        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((item: Faq) => ({
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
