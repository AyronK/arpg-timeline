import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        //ppr: "incremental",
    },
    images: {
        remotePatterns: [{ hostname: "cdn.sanity.io" }],
        dangerouslyAllowSVG: true,
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
                source: "/robots.txt",
                headers: [
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "max-age=86400",
                    },
                ],
            },
            {
                source: "/sitemap.xml",
                headers: [
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "max-age=86400",
                    },
                ],
            },
            {
                source: "/favicon-192.png",
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
                source: "/favicon.ico",
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
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=60",
                    },
                ],
            },
            {
                source: "/",
                headers: [
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=60",
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
