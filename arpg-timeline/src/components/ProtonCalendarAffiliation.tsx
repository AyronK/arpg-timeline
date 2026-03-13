"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";

import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";
import { usePartnerPromos } from "@/contexts/PartnerPromosContext";

export const ProtonCalendarAffiliation = () => {
    const { isPartnerHidden, setDrawerOpen } = usePartnerPromos();

    if (!process.env.NEXT_PUBLIC_PROTON_CALENDAR_AFFILIATE_URL || isPartnerHidden("proton")) {
        return null;
    }

    return (
        <div className="border-border flex hidden flex-col gap-2 border-t pt-2 md:flex">
            <div className="flex justify-end">
                <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors"
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Hide promos (opens settings)"
                >
                    Hide it?
                </button>
            </div>
            <Link
                href={process.env.NEXT_PUBLIC_PROTON_CALENDAR_AFFILIATE_URL}
                rel="noopener noreferrer"
                target="_blank"
                data-sa-click="proton-calendar-affiliation-banner"
                className={getCtaBannerClassName("violet")}
            >
                <CtaBannerContent
                    icon={<Calendar />}
                    title="Proton Calendar - partner offer"
                    description="Buying through our link supports us directly."
                    actionLabel="Get Proton"
                    color="violet"
                />
            </Link>
        </div>
    );
};
