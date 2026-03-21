"use client";

import { usePartnerPromos } from "@/contexts/PartnerPromosContext";

export function FooterPartnerPromosLink() {
    const { setDrawerOpen } = usePartnerPromos();
    return (
        <button
            type="button"
            className="cursor-pointer font-semibold transition-opacity duration-200 hover:opacity-75"
            onClick={() => setDrawerOpen(true)}
            data-sa-click="partner-promos-settings"
        >
            Partners
        </button>
    );
}
