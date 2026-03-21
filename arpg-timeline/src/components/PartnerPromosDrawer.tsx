"use client";

import { PatreonFunding } from "@/components/PatreonFunding";
import { PARTNER_IDS, type PartnerId, usePartnerPromos } from "@/contexts/PartnerPromosContext";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerPortal,
    DrawerTitle,
} from "@/ui/Drawer";
import { Switch } from "@/ui/Switch";

const PARTNER_LABELS: Record<PartnerId, string> = {
    proton: "Proton (Mail, Calendar, VPN, Pass, Drive)",
};

export function PartnerPromosDrawer() {
    const { drawerOpen, setDrawerOpen, isPartnerHidden, setPartnerHidden } = usePartnerPromos();

    return (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
            <DrawerPortal>
                <DrawerContent className="top-0 h-full max-w-3xl">
                    <DrawerHeader className="border-b">
                        <DrawerTitle>Partner promos</DrawerTitle>
                        <DrawerDescription>
                            Control which partner offers you see. The site stays free and ad-free
                            either way.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col gap-6 overflow-y-auto p-6">
                        <p className="text-muted-foreground text-sm text-balance">
                            Partnerships and Patreon support are what keep aRPG Timeline running. If
                            you choose to see partner offers and use our links, you support the site
                            at no extra cost to you.
                        </p>
                        <div>
                            <PatreonFunding />
                        </div>
                        <p className="text-muted-foreground text-sm text-balance">
                            The website remains{" "}
                            <strong className="text-foreground">free of charge</strong> and{" "}
                            <strong className="text-foreground">free of ads</strong>. Partner promos
                            can be turned off anytime below and your choice will be remembered.
                        </p>
                        <p className="text-muted-foreground text-sm text-balance">
                            Want to support directly or browse our full partner offers list?{" "}
                            <a
                                href="/support"
                                className="text-foreground underline transition-opacity hover:opacity-75"
                            >
                                Visit our support page
                            </a>
                            .
                        </p>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-sm font-medium">Show partner promos</h4>
                            <ul className="flex flex-col gap-3">
                                {PARTNER_IDS.map((partnerId) => (
                                    <li
                                        key={partnerId}
                                        className="flex items-center justify-between gap-4 rounded-md border p-3"
                                    >
                                        <label
                                            htmlFor={`partner-${partnerId}`}
                                            className="cursor-pointer text-sm"
                                        >
                                            {PARTNER_LABELS[partnerId]}
                                        </label>
                                        <Switch
                                            id={`partner-${partnerId}`}
                                            checked={!isPartnerHidden(partnerId)}
                                            onCheckedChange={(checked) =>
                                                setPartnerHidden(partnerId, !checked)
                                            }
                                            aria-label={`Show ${PARTNER_LABELS[partnerId]} promos`}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </DrawerContent>
            </DrawerPortal>
        </Drawer>
    );
}
