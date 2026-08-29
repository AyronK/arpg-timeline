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

function buildDescription(dashboard: GameFilterCategory, gameCount: number): string {
    switch (dashboard) {
        case "all":
            return `Season dates, countdowns, and calendar exports for every aRPG - ${gameCount}+ games tracked and updated in real-time.`;
        case "community":
            return `Season dates and countdowns for community-run aRPG servers and mods - calendar exports and real-time updates for every season launch.`;
        case "non-seasonal":
            return `Expansion release dates and major updates for aRPGs without seasonal resets - countdowns and calendar exports, all in one place.`;
        case "early-access":
            return `Season dates and launch countdowns for early access aRPGs - calendar exports and real-time updates so you never miss a season or major update.`;
        default:
            return `The most complete aRPG season tracker - ${gameCount} games from Diablo and Path of Exile to community servers others skip, with live countdowns and calendar sync.`;
    }
}

export async function generateDashboardMetadata(
    dashboard: GameFilterCategory,
    canonicalPath: string = "/",
): Promise<Metadata> {
    const data: IndexQueryResult = await sanityClient.fetch(indexQuery, { revalidate: 3600 });
    const gameNames = data.games.map((g) => parseMetadataKeywords(g.name));

    const isDefault = dashboard === "featured";

    const title = isDefault
        ? `aRPG Timeline | ${data.games.length} aRPGs, Every Season Just On Time`
        : `${dashboardLabels[dashboard]} | aRPG Timeline`;

    const description = buildDescription(dashboard, data.games.length);

    return {
        title,
        description,
        openGraph: {
            title: isDefault ? "aRPG Timeline" : title,
            description,
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
