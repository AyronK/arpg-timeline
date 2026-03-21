"use client";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { sa_event } from "@/lib/sa_event";

import { PRODUCT_LABELS, PRODUCT_URLS } from "./config";
import { HideButton, ProtonLogoLink } from "./shared";
import type { ProductKey, ProtonCardProps } from "./types";

interface Props extends ProtonCardProps {
    a: ProductKey;
    b: ProductKey;
}

export const ProtonTwoProductCard = ({ a, b, onHide }: Props) => {
    const urlA = PRODUCT_URLS[a];
    const urlB = PRODUCT_URLS[b];
    if (!urlA || !urlB) return null;

    return (
        <section className="bg-card text-card-foreground relative flex flex-1 flex-col justify-between gap-3 rounded-md border border-violet-500/20 p-4 shadow-[0_0_10px_1px_rgba(139,92,246,0.08)]">
            <HideButton onClick={onHide} />
            <h3 className="font-heading text-xs">Proton + aRPG Timeline</h3>
            <div className="flex flex-row items-center justify-center gap-2">
                <ProtonLogoLink product={a} url={urlA} displayHeight={64} />
                <ProtonLogoLink product={b} url={urlB} displayHeight={64} />
            </div>
            <p className="text-muted-foreground pb-2 text-center text-xs text-balance">
                Privacy tools from Proton. <br />
                Get a great deal - and keep aRPG Timeline running.
            </p>
            <div className="flex flex-row gap-6 px-2">
                <MaybeLinkWrapper
                    href={urlA}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sa_event(`proton-${a}-cta`)}
                    className="border-border hover:bg-accent flex-1 justify-center rounded-md border px-4 py-1.5 text-center text-xs font-medium transition-colors"
                >
                    <span>{PRODUCT_LABELS[a]} deal</span>
                </MaybeLinkWrapper>
                <MaybeLinkWrapper
                    href={urlB}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sa_event(`proton-${b}-cta`)}
                    className="border-border hover:bg-accent flex-1 justify-center rounded-md border px-4 py-1.5 text-center text-xs font-medium transition-colors"
                >
                    <span>{PRODUCT_LABELS[b]} deal</span>
                </MaybeLinkWrapper>
            </div>
        </section>
    );
};
