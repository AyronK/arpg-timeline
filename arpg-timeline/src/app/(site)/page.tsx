import { Metadata } from "next";

import { Faq } from "@/components/Faq";
import { Main } from "@/components/Home/HomePage";
import { SingleToast } from "@/components/SingleToast";
import { StructuredDataScripts } from "@/components/StructuredDataScripts";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { parseGameStreamsFromSanity } from "@/lib/cms/parseGameStreamsFromSanity";
import { sanityClient, sanityFetch } from "@/lib/sanity/sanityClient";
import { indexQuery, IndexQueryResult } from "@/queries/indexQuery";

type PeakStats = {
    currentPlayers: number;
    peak24h: number;
    peakAllTime: number;
};

// todo: calculate peak in a season
// todo: display in a widget stats for a season and current/24h players
function calculatePeakStats(data: [number, number][]): PeakStats {
    if (data.length === 0) {
        return { peak24h: 0, currentPlayers: 0, peakAllTime: 0 };
    }

    const latestTimestamp = Math.max(...data.map(([timestamp]) => timestamp));

    const oneDayAgo = latestTimestamp - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = latestTimestamp - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = latestTimestamp - 30 * 24 * 60 * 60 * 1000;

    const last24h = data.filter(([timestamp]) => timestamp >= oneDayAgo);
    const last7d = data.filter(([timestamp]) => timestamp >= sevenDaysAgo);
    const last30d = data.filter(([timestamp]) => timestamp >= thirtyDaysAgo);

    const peak24h = last24h.length > 0 ? Math.max(...last24h.map(([, count]) => count)) : 0;
    const peakAllTime = Math.max(...data.map(([, count]) => count));

    return {
        peak24h,
        currentPlayers: data[data.length - 1][1],
        peakAllTime,
    };
}

async function getGamePlayersStats(appId: number): Promise<PeakStats | null> {
    const url = `https://steamcharts.com/app/${appId}/chart-data.json`;
    const response = await fetch(url, { next: { revalidate: 60 * 60 } });

    if (!response.ok) {
        console.error(`Failed to fetch data for appId ${appId}`);
    }

    const data: [number, number][] = await response.json();
    return calculatePeakStats(data);
}

const Home = async () => {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "liveStreamTwitch", "game", "toast"],
    });
    const games = parseGamesFromSanity(data);
    const streams = parseGameStreamsFromSanity(data);

    const players = await getGamePlayersStats(238960);
    console.log(players);

    return (
        <>
            {JSON.stringify(players, null, "\t")}
            {data.toast && <SingleToast data={data.toast} />}
            <div className="relative container mx-auto mb-8">
                <Kicker />
                <Main games={games} streams={streams} />
            </div>
            <StructuredDataScripts games={games} />
            <Faq patreonUrl={process.env.PATREON_URL!} faq={data.faq} />
        </>
    );
};

export const revalidate = 900;

export default Home;

const Kicker = () => (
    <p className="font-heading mx-auto hidden max-w-prose text-center text-lg md:mt-8 md:block md:text-xl">
        Stay ahead in your favorite ARPGs with the season tracker.
        <br />
        Never miss a season start or end again!
    </p>
);

function parseMetadataKeywords(input: string) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9,\s-]/g, "")
        .trim();
}

export async function generateMetadata(): Promise<Metadata> {
    const data: IndexQueryResult = await sanityClient.fetch(indexQuery, { revalidate: 3600 });
    const gameNames = data.games.map((g) => parseMetadataKeywords(g.name));

    return {
        title: "aRPG Timeline | Season Tracker",
        description: "Stay ahead in your favorite aRPGs with our season tracker",
        openGraph: {
            title: "aRPG Timeline",
            description: "Track aRPG seasons for Path of Exile, Diablo, and more",
            siteName: "aRPG Timeline",
            type: "website",
            url: "https://arpg-timeline.com",
            images: [
                {
                    url: "/assets/seoimage.png",
                    width: 1200,
                    height: 630,
                    alt: "aRPG Timeline | Season Tracker",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            images: ["/assets/seoimage.png"],
        },
        keywords: [
            ...gameNames,
            "arpg seasons",
            "arpg tracker",
            "action rpg",
            "new season release date",
            "league start",
            "arpg, best arpgs",
            "diablo alternative",
            "poe alternativ",
            "upcoming arpg",
            "countdown",
            "poe",
            "d2",
            "d3",
            "d4",
        ],
        alternates: { canonical: "/" },
    };
}

export const experimental_ppr = true;
