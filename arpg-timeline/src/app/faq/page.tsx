import { Metadata } from "next";

import { Faq } from "@/components/Faq";
import { faqQuery, FaqQueryResult } from "@/lib/cms/queries/faqQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

export const metadata: Metadata = {
    title: "FAQ - ARPG Timeline",
    description: "Frequently asked questions about ARPG Timeline",
};

export default async function FaqPage() {
    const data: FaqQueryResult = await sanityFetch({
        query: faqQuery,
        revalidate: 24 * 60 * 60,
        tags: ["faq"],
    });

    return (
        <div className="container mx-auto mb-8">
            <Faq faq={data.faq} />
        </div>
    );
}
