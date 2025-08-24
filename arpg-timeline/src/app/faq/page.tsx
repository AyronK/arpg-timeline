import { Metadata } from "next";

import { Faq } from "@/components/Faq";
import { FAQSchema } from "@/components/FAQSchema";
import { faqQuery, FaqQueryResult } from "@/lib/cms/queries/faqQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

export const metadata: Metadata = {
    title: "FAQ - aRPG Timeline",
    description: "Frequently asked questions about aRPG Timeline",
};

export default async function FaqPage() {
    const data: FaqQueryResult = await sanityFetch({
        query: faqQuery,
        revalidate: 30 * 24 * 60 * 60,
        tags: ["faq"],
    });

    return (
        <>
            <FAQSchema />
            <div className="container mx-auto mb-8">
                <Faq faq={data.faq} />
            </div>
        </>
    );
}

export const revalidate = 30 * 24 * 60 * 60;
