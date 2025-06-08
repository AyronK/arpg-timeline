import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // TODO check
    // experimental: {
    //     ppr: "incremental",
    // },
    images: {
        remotePatterns: [{ hostname: "cdn.sanity.io" }],
        dangerouslyAllowSVG: true,
        deviceSizes: [375, 425, 512, 768, 1024, 1440],
        imageSizes: [32, 48, 64, 96, 128, 156, 256],
        minimumCacheTTL: 30 * 24 * 60 * 60,
    },
    async headers() {
        return [
            {
                source: "/assets/:path*",
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
                source: "/img/:path*",
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
                source: "/icon.png",
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
                source: "/index",
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
