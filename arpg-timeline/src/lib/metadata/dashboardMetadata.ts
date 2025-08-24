import { Metadata } from "next";

import { DashboardTag } from "@/lib/cms/gameTags";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityClient } from "@/lib/sanity/sanityClient";

export function parseMetadataKeywords(input: string) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9,\s-]/g, "")
        .trim();
}

const dashboardLabels: Record<string, string> = {
    default: "Default",
    "default-when-next-confirmed": "Default",
    other: "Other Games",
    community: "Community Games",
    seasonal: "Seasonal Games",
    "early-access": "Early Access Games",
    everything: "Full Catalog",
};

export async function generateDashboardMetadata(
    dashboard: DashboardTag,
    canonicalPath: string = "/",
): Promise<Metadata> {
    const data: IndexQueryResult = await sanityClient.fetch(indexQuery, { revalidate: 3600 });
    const gameNames = data.games.map((g) => parseMetadataKeywords(g.name));

    const isDefault = dashboard === "default" || dashboard === "default-when-next-confirmed";

    const title = isDefault
        ? "aRPG Timeline | Season Tracker"
        : `${dashboardLabels[dashboard]} | aRPG Timeline`;

    const description = "Stay ahead in your favorite aRPGs with our season tracker";

    return {
        title,
        description,
        openGraph: {
            title: isDefault ? "aRPG Timeline" : title,
            description: isDefault ? "Track your favorite aRPG game seasons" : description,
            siteName: "aRPG Timeline",
            type: "website",
            url: `https://www.arpg-timeline.com${canonicalPath}`,
            locale: "en_US",
            images: [
                {
                    url: "/assets/seoimage.png",
                    width: 1200,
                    height: 630,
                    alt: "aRPG Timeline - Track your favorite aRPG game seasons",
                    type: "image/png",
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
            "path of exile seasons",
            "diablo 4 seasons",
            "last epoch seasons",
            "arpg countdown",
            "season launch date",
            "arpg news",
            "gaming calendar",
            "poe league",
            "diablo season",
        ],
        alternates: { canonical: canonicalPath },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}
