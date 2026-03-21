"use client";
import { useState } from "react";

import { usePartnerPromos } from "@/contexts/PartnerPromosContext";

import { PRODUCT_URLS } from "./config";
import { ProtonProductBannerCard } from "./ProtonProductBannerCard";
import { ProtonProductLogoCard } from "./ProtonProductLogoCard";
import { ProtonTwoProductCard } from "./ProtonTwoProductCard";
import type { BannerProductKey, ProductKey } from "./types";

type Variant =
    | { type: "two"; a: ProductKey; b: ProductKey }
    | { type: "logo"; product: ProductKey }
    | { type: "banner"; product: BannerProductKey };

const BANNER_PRODUCTS: BannerProductKey[] = ["mail", "vpn", "drive"];

// Env vars are build-time constants - compute the variant pool once at module load.
const availableProducts = (Object.keys(PRODUCT_URLS) as ProductKey[]).filter(
    (k) => PRODUCT_URLS[k] !== null,
);

const VARIANTS: Variant[] = [
    // All two-product combinations
    ...availableProducts.flatMap((a, i) =>
        availableProducts.slice(i + 1).map((b) => ({ type: "two" as const, a, b })),
    ),
    // Single-product logo cards
    ...availableProducts.map((product) => ({ type: "logo" as const, product })),
    // Single-product banner cards (only products that have a banner asset)
    ...BANNER_PRODUCTS.filter((p) => availableProducts.includes(p)).map((product) => ({
        type: "banner" as const,
        product,
    })),
];

const INITIAL_HOUR_INDEX = Math.floor(Date.now() / 3_600_000);

function variantLabel(v: Variant) {
    if (v.type === "two") return `two: ${v.a} + ${v.b}`;
    if (v.type === "logo") return `logo: ${v.product}`;
    return `banner: ${v.product}`;
}

/**
 * Picks a variant deterministically based on the current hour so that:
 * - every user sees the same card at the same time (no per-mount randomness)
 * - the slot rotates to the next variant each hour
 * - all variants get equal exposure over a full cycle
 *
 * Returns null when no affiliate URLs are configured.
 */
export const ProtonDashboardCard = () => {
    const { setDrawerOpen } = usePartnerPromos();
    const isDev = process.env.NODE_ENV === "development";
    const [debugIndex, setDebugIndex] = useState<number | null>(null);

    if (VARIANTS.length === 0) return null;

    if (
        PRODUCT_URLS.mail === null ||
        PRODUCT_URLS.vpn === null ||
        PRODUCT_URLS.pass === null ||
        PRODUCT_URLS.drive === null
    )
        return null;

    const activeIndex = debugIndex ?? INITIAL_HOUR_INDEX % VARIANTS.length;
    const variant = VARIANTS[activeIndex];

    const onHide = () => setDrawerOpen(true);

    const card =
        variant.type === "two" ? (
            <ProtonTwoProductCard a={variant.a} b={variant.b} onHide={onHide} />
        ) : variant.type === "logo" ? (
            <ProtonProductLogoCard product={variant.product} onHide={onHide} />
        ) : (
            <ProtonProductBannerCard product={variant.product} onHide={onHide} />
        );

    if (!isDev) return card;

    return (
        <div style={{ position: "relative" }} className="flex flex-1">
            {card}
            <button
                onClick={() =>
                    setDebugIndex(
                        ((debugIndex ?? INITIAL_HOUR_INDEX % VARIANTS.length) + 1) %
                            VARIANTS.length,
                    )
                }
                style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    zIndex: 9999,
                    background: "rgba(0,0,0,0.75)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontSize: 11,
                    cursor: "pointer",
                    lineHeight: 1.4,
                }}
                title="Debug: cycle variants"
            >
                {activeIndex + 1}/{VARIANTS.length} · {variantLabel(variant)}
            </button>
        </div>
    );
};
