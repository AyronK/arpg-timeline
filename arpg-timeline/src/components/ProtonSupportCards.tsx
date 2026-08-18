"use client";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";

import { PRODUCT_LABELS, PRODUCT_URLS } from "./Dashboard/ProtonDashboardCard/config";
import { ProtonLogoLink } from "./Dashboard/ProtonDashboardCard/shared";
import type { ProductKey } from "./Dashboard/ProtonDashboardCard/types";

const ALL_PRODUCTS: ProductKey[] = ["pass", "mail", "vpn", "drive"];

export const ProtonSupportCards = () => {
    const mainUrl = process.env.NEXT_PUBLIC_PROTON_CALENDAR_AFFILIATE_URL;
    const logoUrls = ALL_PRODUCTS.filter((p) => PRODUCT_URLS[p]);

    return (
        <div className="flex flex-col gap-4">
            {mainUrl && (
                <Link
                    href={mainUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    data-sa-click="proton-pass-support-endorsement"
                    className={getCtaBannerClassName("violet")}
                >
                    <CtaBannerContent
                        icon={<ShieldCheck className="h-6 w-6 text-violet-400 md:h-7 md:w-7" />}
                        title="Why we recommend Proton"
                        description="Our own inbox runs on Proton Mail with aliases for every site we sign up to, Pass holds every password and secret we have, and we use Proton Calendar to subscribe to season and event reminders - the same kind this site tracks. This link gets you a deal and supports aRPG Timeline directly."
                        actionLabel="Get Proton"
                        color="violet"
                        layout="mobile-stacked"
                    />
                </Link>
            )}

            {logoUrls.length > 0 && (
                <div className="flex flex-col gap-3">
                    <p className="text-muted-foreground text-center text-xs">
                        Also part of the deal: Proton{" "}
                        {logoUrls.map((p) => PRODUCT_LABELS[p]).join(", ")}.
                    </p>
                    <div className="flex flex-row flex-wrap items-center justify-center gap-6">
                        {logoUrls.map((p) => {
                            const url = PRODUCT_URLS[p];
                            if (!url) return null;
                            return (
                                <ProtonLogoLink key={p} product={p} url={url} displayHeight={44} />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
