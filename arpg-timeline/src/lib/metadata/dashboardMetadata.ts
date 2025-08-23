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

    const description = isDefault
        ? "Stay ahead in your favorite aRPGs with our season tracker"
        : `Track ${dashboardLabels[dashboard].toLowerCase()} in the aRPG timeline`;

    return {
        title,
        description,
        openGraph: {
            title: isDefault ? "aRPG Timeline" : title,
            description: isDefault
                ? "Track aRPG seasons for Path of Exile, Diablo, and more"
                : description,
            siteName: "aRPG Timeline",
            type: "website",
            url: `https://arpg-timeline.com${canonicalPath}`,
            images: [
                {
                    url: "/assets/seoimage.png",
                    width: 1200,
                    height: 630,
                    alt: title,
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
        alternates: { canonical: canonicalPath },
    };
}
