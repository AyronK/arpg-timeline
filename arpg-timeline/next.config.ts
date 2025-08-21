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
                        key: "Content-Security-Policy",
                        value: "frame-ancestors *;",
                    },
                ],
            },
            {
                source: "/_next/static/:path*",
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
                source: "/assets/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=2592000",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=31536000",
                    },
                ],
            },
            {
                source: "/img/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=2592000",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=31536000",
                    },
                ],
            },
            {
                source: "/embed/season-widget/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=300",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=86400, stale-while-revalidate=300",
                    },
                ],
            },
            {
                source: "/docs/html/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=86400, stale-while-revalidate=86400",
                    },
                ],
            },
            {
                source: "/docs/obs/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=86400, stale-while-revalidate=86400",
                    },
                ],
            },
            {
                source: "/robots.txt",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=86400",
                    },
                ],
            },
            {
                source: "/sitemap.xml",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=86400",
                    },
                ],
            },
            {
                source: "/favicon-192.png",
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
                source: "/favicon.ico",
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
                source: "/",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=300",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=86400, stale-while-revalidate=300",
                    },
                ],
            },
            {
                source: "/privacy",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=86400, stale-while-revalidate=86400",
                    },
                ],
            },
            {
                source: "/looking-for-moderators",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=86400, stale-while-revalidate=86400",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
