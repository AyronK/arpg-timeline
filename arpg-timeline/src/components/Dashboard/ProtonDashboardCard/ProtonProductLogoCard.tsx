"use client";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";

import { PRODUCT_CTA, PRODUCT_PITCH, PRODUCT_URLS } from "./config";
import { HideButton, ProtonLogoLink } from "./shared";
import type { ProductKey, ProtonCardProps } from "./types";

interface Props extends ProtonCardProps {
    product: ProductKey;
}

export const ProtonProductLogoCard = ({ product, onHide }: Props) => {
    const url = PRODUCT_URLS[product];
    if (!url) return null;

    return (
        <section className="bg-card text-card-foreground relative flex flex-1 flex-col justify-between gap-3 rounded-md border border-violet-500/20 p-4 shadow-[0_0_10px_1px_rgba(139,92,246,0.08)]">
            {onHide && <HideButton onClick={onHide} />}
            <h3 className="font-heading text-xs">Proton + aRPG Timeline</h3>
            <div className="flex justify-center py-2">
                <ProtonLogoLink product={product} url={url} displayHeight={80} />
            </div>
            <p className="text-muted-foreground pb-2 text-center text-xs text-balance break-words whitespace-pre-wrap">
                {PRODUCT_PITCH[product]}
            </p>
            <MaybeLinkWrapper
                href={url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                data-sa-click={`proton-${product}-cta`}
                className="border-border hover:bg-accent justify-center rounded-md border px-4 py-1.5 text-center text-xs font-medium transition-colors"
            >
                <span className="mr-1">{PRODUCT_CTA[product]}</span>
            </MaybeLinkWrapper>
        </section>
    );
};
