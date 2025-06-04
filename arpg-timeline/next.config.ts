import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // TODO check
    // experimental: {
    //     ppr: "incremental",
    // },
    async headers() {
        return [
            {
                source: "/assets",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=2592000, immutable",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/img",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=2592000, immutable",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=3600",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=3600",
                    },
                ],
            },
            {
                source: "/privacy",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, s-max-age=31536000",
                    },
                ],
            },
            {
                source: "/looking-for-moderators",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, s-max-age=31536000",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
