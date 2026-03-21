"use client";

import { usePartnerPromos } from "@/contexts/PartnerPromosContext";

export function FooterPartnerPromosLink() {
    const { setDrawerOpen } = usePartnerPromos();
    return (
        <button
            type="button"
            className="hover:text-primary flex cursor-pointer font-semibold transition-all duration-200 hover:translate-x-1"
            onClick={() => setDrawerOpen(true)}
            data-sa-click="partner-promos-settings"
        >
            Partner dealsa
        </button>
    );
}
