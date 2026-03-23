"use client";
import Image from "next/image";
import Link from "next/link";

import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";

import { BANNER_ASSETS, PRODUCT_CTA, PRODUCT_LABELS, PRODUCT_PITCH, PRODUCT_URLS } from "./config";
import { HideButton } from "./shared";
import type { BannerProductKey, ProtonCardProps } from "./types";

interface Props extends ProtonCardProps {
    product: BannerProductKey;
}

export const ProtonProductBannerCard = ({ product, onHide }: Props) => {
    const url = PRODUCT_URLS[product];
    if (!url) return null;

    const banner = BANNER_ASSETS[product];
    return (
        <section className="bg-card text-card-foreground relative flex flex-1 flex-col justify-between gap-3 rounded-md border border-violet-500/20 p-4 shadow-[0_0_10px_1px_rgba(139,92,246,0.08)]">
            {onHide && <HideButton onClick={onHide} />}
            <h3 className="font-heading text-xs">Proton + aRPG Timeline</h3>
            <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                data-sa-click={`proton-${product}-banner`}
                className="block py-4"
            >
                <Image
                    src={banner.src}
                    alt={`Proton ${PRODUCT_LABELS[product]} deal`}
                    width={banner.w}
                    height={banner.h}
                    loading="lazy"
                    unoptimized
                    className="h-auto w-full cursor-pointer rounded-md transition-all ease-in-out hover:scale-[1.02]"
                />
            </Link>
            <p className="text-muted-foreground pb-2 text-center text-xs text-balance break-words whitespace-pre-wrap">
                {PRODUCT_PITCH[product]}
            </p>
            <MaybeLinkWrapper
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                data-sa-click={`proton-${product}-cta`}
                className="border-border hover:bg-accent justify-center rounded-md border px-4 py-1.5 text-center text-xs font-medium transition-colors"
            >
                <span className="mr-1">{PRODUCT_CTA[product]}</span>
            </MaybeLinkWrapper>
        </section>
    );
};
