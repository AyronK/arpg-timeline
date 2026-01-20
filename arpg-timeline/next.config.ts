import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    },
    env: {
        NEXT_PUBLIC_PATREON_URL: process.env.PATREON_URL,
        NEXT_PUBLIC_GITHUB_URL: process.env.GITHUB_URL,
        NEXT_PUBLIC_GITHUB_REPO: process.env.GITHUB_REPO,
        NEXT_PUBLIC_DISCORD_URL: process.env.DISCORD_URL,
        NEXT_PUBLIC_CONTACT_EMAIL: process.env.CONTACT_EMAIL,
        NEXT_PUBLIC_SITE_URL: process.env.SITE_URL,
    },
    images: {
        remotePatterns: [{ hostname: "cdn.sanity.io" }],
        dangerouslyAllowSVG: true,
        minimumCacheTTL: 31536000,
        formats: ["image/webp"],
        deviceSizes: [640, 1080, 1920],
        imageSizes: [32, 64, 128, 256],
    },
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
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
                source: "/_next/image/:path*",
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
                source: "/embed/countdown-widget/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=300",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=3600, stale-while-revalidate=300",
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
                        value: "public, max-age=3600, stale-while-revalidate=300",
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
                        value: "public, max-age=3600, stale-while-revalidate=300",
                    },
                ],
            },
            {
                source: "/dashboard/:path",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=300",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=3600, stale-while-revalidate=300",
                    },
                ],
            },
            {
                source: "/game/:path",
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
            {
                source: "/faq",
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
                source: "/calendar/subscribe",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=0, must-revalidate",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=3600, stale-while-revalidate=300",
                    },
                ],
            },
            {
                source: "/calendar/subscribe/:gameSlug",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=0, must-revalidate",
                    },
                    {
                        key: "Vercel-CDN-Cache-Control",
                        value: "public, max-age=3600, stale-while-revalidate=300",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
