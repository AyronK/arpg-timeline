import type { MetadataRoute } from "next";

import { DashboardConfig } from "@/components/Dashboard/DashboardConfig";
import { indexQuery } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://www.arpg-timeline.com";
    const sitemap: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/looking-for-moderators`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];

    try {
        const data = await sanityFetch({
            query: indexQuery,
            revalidate: 3600,
            tags: ["game", "season"],
        });

        const games = data.games || [];

        games.forEach((game: { slug: string }) => {
            if (game.slug) {
                sitemap.push(
                    {
                        url: `${baseUrl}/game/${game.slug}`,
                        lastModified: new Date(),
                        changeFrequency: "daily",
                        priority: 0.8,
                    },
                    {
                        url: `${baseUrl}/docs/html/${game.slug}`,
                        lastModified: new Date(),
                        changeFrequency: "yearly",
                        priority: 0.6,
                    },
                    {
                        url: `${baseUrl}/docs/obs/${game.slug}`,
                        lastModified: new Date(),
                        changeFrequency: "yearly",
                        priority: 0.6,
                    },
                );
            }
        });

        Object.keys(DashboardConfig)
            .filter(
                (dashboard) =>
                    dashboard !== "default-when-next-confirmed" && dashboard !== "everything",
            )
            .forEach((dashboard) => {
                sitemap.push({
                    url: `${baseUrl}/dashboard/${dashboard}`,
                    lastModified: new Date(),
                    changeFrequency: "daily",
                    priority: 1,
                });
            });
    } catch (error) {
        console.error("Error fetching data for sitemap:", error);
    }

    return sitemap;
}

export const revalidate = 3600;
