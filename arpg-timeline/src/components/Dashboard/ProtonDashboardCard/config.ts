import type { BannerProductKey, ProductKey } from "./types";

/** Affiliate URLs - baked at build time via NEXT_PUBLIC_* env vars. */
export const PRODUCT_URLS: Record<ProductKey, string | null> = {
    mail: process.env.NEXT_PUBLIC_PROTON_MAIL_AFFILIATE_URL ?? null,
    vpn: process.env.NEXT_PUBLIC_PROTON_VPN_AFFILIATE_URL ?? null,
    pass: process.env.NEXT_PUBLIC_PROTON_PASS_AFFILIATE_URL ?? null,
    drive: process.env.NEXT_PUBLIC_PROTON_DRIVE_AFFILIATE_URL ?? null,
};

export const PRODUCT_LABELS: Record<ProductKey, string> = {
    mail: "Mail",
    vpn: "VPN",
    pass: "Pass",
    drive: "Drive",
};

export const PRODUCT_PITCH: Record<ProductKey, string> = {
    mail: "Trade sites and third-party tools don't need your real inbox.\nProton Mail keeps it separate - deal included.",
    vpn: "Access other regional game servers, or just browse privately.\nProton VPN deal - and keep aRPG Timeline running.",
    pass: "Your account is worth more than you think.\nProton Pass keeps the login safe - deal included.",
    drive: "Back up settings, screenshots and clips before a drive dies.\nProton Drive deal - and keep aRPG Timeline running.",
};

export const PRODUCT_CTA: Record<ProductKey, string> = {
    mail: "Get a private inbox",
    vpn: "Get the Proton VPN deal",
    pass: "Secure your account with Pass",
    drive: "Back it up with Drive",
};

export const LOGO_ASSETS: Record<ProductKey, { src: string; w: number; h: number }> = {
    mail: {
        src: "/assets/third-party/Mail-logomark-logotype-white-transparent.svg",
        w: 5704,
        h: 2064,
    },
    vpn: {
        src: "/assets/third-party/VPN-logomark-logotype-white-transparent.svg",
        w: 5834,
        h: 2064,
    },
    pass: { src: "/assets/third-party/Pass-logotype-white-transparent.svg", w: 23020, h: 8256 },
    drive: {
        src: "/assets/third-party/Drive-logomark-logotype-white-transparent.svg",
        w: 5894,
        h: 2064,
    },
};

export const BANNER_ASSETS: Record<BannerProductKey, { src: string; w: number; h: number }> = {
    mail: { src: "/assets/third-party/Mail_EED_320X50.png", w: 320, h: 50 },
    vpn: { src: "/assets/third-party/VPN_SVD_320x50.png", w: 320, h: 50 },
    /** File is 1200×180 (2×); display at 600×90. */
    drive: { src: "/assets/third-party/drive_affiliate_600x90.png", w: 600, h: 90 },
};
