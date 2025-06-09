import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://www.arpg-timeline.com",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: "https://www.arpg-timeline.com/looking-for-moderators",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: "https://www.arpg-timeline.com/privacy",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];
}
