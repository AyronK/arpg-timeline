"use client";
import Image from "next/image";
import Link from "next/link";

import { LOGO_ASSETS, PRODUCT_LABELS } from "./config";
import type { ProductKey } from "./types";

export const HideButton = ({ onClick }: { onClick: () => void }) => (
    <button
        type="button"
        className="text-muted-foreground hover:text-foreground absolute top-3.5 right-2 cursor-pointer rounded px-1.5 py-0.25 text-[10px] font-medium transition-colors"
        onClick={onClick}
        aria-label="Hide promos (opens settings)"
    >
        Hide it?
    </button>
);

/** Proton logotype image at an exact computed size, wrapped in an affiliate link. */
export const ProtonLogoLink = ({
    product,
    url,
    displayHeight,
}: {
    product: ProductKey;
    url: string;
    displayHeight: number;
}) => {
    const logo = LOGO_ASSETS[product];
    const displayWidth = Math.round((displayHeight * logo.w) / logo.h);
    return (
        <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            data-sa-click={`proton-${product}-logo`}
        >
            <Image
                src={logo.src}
                alt={`Proton ${PRODUCT_LABELS[product]}`}
                width={displayWidth}
                height={displayHeight}
                loading="lazy"
                unoptimized
                className="cursor-pointer transition-all ease-in-out hover:scale-105"
            />
        </Link>
    );
};
