"use client";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { sa_event } from "@/lib/sa_event";

import { PRODUCT_LABELS, PRODUCT_URLS } from "./ProtonDashboardCard.config";
import { HideButton, ProtonLogoLink } from "./ProtonDashboardCard/shared";
import { ProductKey, ProtonCardProps } from "./ProtonDashboardCard/types";

interface Props extends ProtonCardProps {
    a: ProductKey;
    b: ProductKey;
}

export const ProtonTwoProductCard = ({ a, b, onHide }: Props) => {
    const urlA = PRODUCT_URLS[a];
    const urlB = PRODUCT_URLS[b];
    if (!urlA || !urlB) return null;

    return (
        <section className="bg-card text-card-foreground relative flex flex-col justify-between gap-3 rounded-md border p-4">
            <HideButton onClick={onHide} />
            <h3 className="font-heading text-xs">Proton with aRPG Timeline</h3>
            <div className="flex flex-row items-center justify-center gap-2">
                <ProtonLogoLink product={a} url={urlA} displayHeight={56} />
                <ProtonLogoLink product={b} url={urlB} displayHeight={56} />
            </div>
            <p className="text-muted-foreground pb-2 text-center text-xs text-balance">
                Privacy tools for aRPG players - every signup supports aRPG Timeline directly.
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
