"use client";
import Image from "next/image";
import Link from "next/link";

import { usePartnerPromos } from "@/contexts/PartnerPromosContext";

const AFFILIATE_LINK =
    "https://go.getproton.me/aff_c?offer_id=26&aff_id=16678&source=arpg-timeline";

export const ProtonDashboardCard = () => {
    const { setDrawerOpen } = usePartnerPromos();
    return (
        <div className="bg-card relative flex max-h-[272px] flex-col gap-2 rounded-md p-4">
            <button
                type="button"
                className="text-muted-foreground hover:text-foreground absolute top-1 right-1 cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors"
                onClick={() => setDrawerOpen(true)}
                aria-label="Hide promos (opens settings)"
            >
                Hide?
            </button>
            <div>
                <h3 className="mb-1 text-sm font-medium">Support aRPG Timeline</h3>
                <p className="text-muted-foreground max-w-[320px] min-w-0 text-xs">
                    Getting Proton through our links supports us directly.
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <h4 className="font-heading text-foreground flex-1 text-sm">Proton Mail</h4>
                <Link href={AFFILIATE_LINK} className="mx-auto block shrink-0">
                    <Image
                        src="/assets/Mail_EED_320X50.png"
                        alt="Proton Mail deal"
                        width={320}
                        height={50}
                        className="h-auto w-full max-w-[320px] rounded-md"
                    />
                </Link>
                <h4 className="font-heading text-foreground flex-1 text-sm">Proton VPN</h4>
                <Link href={AFFILIATE_LINK} className="mx-auto block shrink-0">
                    <Image
                        src="/assets/VPN_SVD_320x50.png"
                        alt="Proton VPN deal"
                        width={320}
                        height={50}
                        className="h-auto w-full max-w-[320px] rounded-md"
                    />
                </Link>
            </div>
        </div>
    );
};
