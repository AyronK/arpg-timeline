import { Metadata } from "next";

import { Main } from "@/components/Home/HomePage";
import { SingleToast } from "@/components/SingleToast";
import { StructuredDataScripts } from "@/components/StructuredDataScripts";
import { useGamesFromMarkdown } from "@/lib/cms/useGamesFromMarkdown";
import { useGameStreamsFromMarkdown } from "@/lib/cms/useGameStreamsFromMarkdown";

import { MOCK_DATA } from "./MOCK_DATA";

export default function Home() {
    const games = useGamesFromMarkdown(MOCK_DATA);
    const streams = useGameStreamsFromMarkdown(MOCK_DATA);
    return (
        <>
            <SingleToast data={MOCK_DATA.toasts.edges[0]?.node?.frontmatter} />
            <div className="relative container mx-auto mb-8">
                <Kicker />
                <Main games={games} streams={streams} />
            </div>
            <StructuredDataScripts games={games} />
        </>
    );
}

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

export const revalidate = 1; //TODO check how to optimize without flickering

// export const experimental_ppr = true; // TODO optimize ppr