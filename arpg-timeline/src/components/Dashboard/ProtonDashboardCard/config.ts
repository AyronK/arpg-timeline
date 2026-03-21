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
    mail: "Private email from Proton.\nGet a great deal - and keep aRPG Timeline running.",
    vpn: "Private browsing from Proton.\nGet a great deal - and keep aRPG Timeline running.",
    pass: "Password manager from Proton.\nGet a great deal - and keep aRPG Timeline running.",
    drive: "Encrypted cloud storage from Proton.\nGet a great deal - and keep aRPG Timeline running.",
};

export const PRODUCT_CTA: Record<ProductKey, string> = {
    mail: "Get the Proton Mail deal",
    vpn: "Get the Proton VPN deal",
    pass: "Get the Proton Pass deal",
    drive: "Get the Proton Drive deal",
};

export const LOGO_ASSETS: Record<ProductKey, { src: string; w: number; h: number }> = {
    mail: { src: "/assets/Mail-logomark-logotype-white-transparent.svg", w: 5704, h: 2064 },
    vpn: { src: "/assets/VPN-logomark-logotype-white-transparent.svg", w: 5834, h: 2064 },
    pass: { src: "/assets/Pass-logotype-white-transparent.svg", w: 23020, h: 8256 },
    drive: { src: "/assets/Drive-logomark-logotype-white-transparent.svg", w: 5894, h: 2064 },
};

export const BANNER_ASSETS: Record<BannerProductKey, { src: string; w: number; h: number }> = {
    mail: { src: "/assets/Mail_EED_320X50.png", w: 320, h: 50 },
    vpn: { src: "/assets/VPN_SVD_320x50.png", w: 320, h: 50 },
    /** File is 1200×180 (2×); display at 600×90. */
    drive: { src: "/assets/drive_affiliate_600x90.png", w: 600, h: 90 },
};
