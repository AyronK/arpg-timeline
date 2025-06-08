import { Metadata } from "next";

import { Faq } from "@/components/Faq";
import { Main } from "@/components/Home/HomePage";
import { SingleToast } from "@/components/SingleToast";
import { StructuredDataScripts } from "@/components/StructuredDataScripts";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { parseGameStreamsFromSanity } from "@/lib/cms/parseGameStreamsFromSanity";
import { sanityClient } from "@/lib/sanity/sanityClient";
import { indexQuery, IndexQueryResult } from "@/queries/indexQuery";

const Home = async () => {
    const data: IndexQueryResult = await sanityClient.fetch(indexQuery, { revalidate: 3600 });
    const games = parseGamesFromSanity(data);
    const streams = parseGameStreamsFromSanity(data);

    return (
        <>
            {data.toast && <SingleToast data={data.toast} />}
            <div className="relative container mx-auto mb-8">
                <Kicker />
                <Main games={games} streams={streams} />
            </div>
            <StructuredDataScripts games={games} />
            <Faq faq={data.faq} />
        </>
    );
};

export default Home;

const Kicker = () => (
    <p className="font-heading mx-auto hidden max-w-prose text-center text-lg md:mt-8 md:block md:text-xl">
        Stay ahead in your favorite ARPGs with the season tracker.
        <br />
        Never miss a season start or end again!
    </p>
);

export const metadata: Metadata = {
    title: "ARPG Timeline | Season Tracker",
    description: "Stay ahead in your favorite ARPGs with our season tracker",
    openGraph: {
        title: "ARPG Timeline",
        description: "Track ARPG seasons for Path of Exile, Diablo, and more",
        siteName: "ARPG Timeline",
        type: "website",
        url: "https://arpg-timeline.com",
        images: [
            {
                url: "/assets/seoimage.png",
                width: 1200,
                height: 630,
                alt: "ARPG Timeline | Season Tracker",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: ["/assets/seoimage.png"],
    },
};
