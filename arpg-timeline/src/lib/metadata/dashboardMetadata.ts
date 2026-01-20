import { Metadata } from "next";

import { GameFilterCategory } from "@/lib/cms/gameTags";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityClient } from "@/lib/sanity/sanityClient";

export function parseMetadataKeywords(input: string) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9,\s-]/g, "")
        .trim();
}

const dashboardLabels: Record<GameFilterCategory, string> = {
    featured: "Featured",
    community: "Community Games",
    "non-seasonal": "Non-Seasonal Games",
    "early-access": "Early Access Games",
    all: "Full Catalog",
};

export async function generateDashboardMetadata(
    dashboard: GameFilterCategory,
    canonicalPath: string = "/",
): Promise<Metadata> {
    const data: IndexQueryResult = await sanityClient.fetch(indexQuery, { revalidate: 3600 });
    const gameNames = data.games.map((g) => parseMetadataKeywords(g.name));

    const isDefault = dashboard === "featured";

    const title = isDefault
        ? "aRPG Timeline | Every season. Just on time."
        : `${dashboardLabels[dashboard]} | aRPG Timeline`;

    const description =
        "Track Diablo 4, Path of Exile 2, Last Epoch seasons and league start dates. Get countdowns for D4 seasons, PoE2 leagues, and never miss an ARPG launch.";

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
            "poe alternative",
            "upcoming arpg",
            "countdown",
            "poe",
            "poe2",
            "poe 2",
            "d2",
            "d3",
            "d4",
            "path of exile seasons",
            "path of exile 2 league",
            "poe2 league",
            "poe 2 league",
            "poe 2 next league",
            "poe2 next league",
            "when is poe 2 next league",
            "diablo 4 seasons",
            "last epoch seasons",
            "arpg countdown",
            "season launch date",
            "arpg news",
            "gaming calendar",
            "poe league",
            "poe next league",
            "diablo season",
            "arpg calendar",
            "poe 2 calendar",
            "diablo 4 calendar",
            "gaming calendar",
            "season calendar subscription",
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
