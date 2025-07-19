import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        //ppr: "incremental",
    },
    images: {
        remotePatterns: [{ hostname: "cdn.sanity.io" }],
        dangerouslyAllowSVG: true,
        minimumCacheTTL: 30 * 24 * 60 * 60,
        unoptimized: true,
    },
    async headers() {
        return [
            {
                source: "/((?!embed).*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: "frame-ancestors 'none';",
                    },
                ],
            },
            {
                source: "/embed/:path*",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "ALLOWALL",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: "frame-ancestors *;",
                    },
                ],
            },
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
                source: "/404",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
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
                source: "/embed/season-widget/:path*",
                headers: [
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=43200",
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
