import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "aRPG Timeline",
        short_name: "aRPG Timeline",
        start_url: "/",
        theme_color: "#082f49",
        background_color: "#082f49",
        display: "standalone",
        icons: [
            {
                src: "/favicon-192.png",
                type: "image/png",
                sizes: "192x192",
            },
            {
                src: "/favicon-512.png",
                type: "image/png",
                sizes: "512x512",
            },
        ],
    };
}
