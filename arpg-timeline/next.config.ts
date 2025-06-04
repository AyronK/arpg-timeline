import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // TODO check
    // experimental: {
    //     ppr: "incremental",
    // },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/privacy',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-max-age=31536000',
          },
        ],
      },
      {
        source: '/looking-for-moderators',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-max-age=31536000',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
