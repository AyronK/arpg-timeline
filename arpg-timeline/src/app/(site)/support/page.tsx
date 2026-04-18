import { Metadata } from "next";

import { BuyMeACoffee } from "@/components/BuyMeACoffee";
import { DiscordServerBoost } from "@/components/DiscordServerBoost";
import { PatreonFunding } from "@/components/PatreonFunding";
import { ProtonSupportCards } from "@/components/ProtonSupportCards";
import { SupportersSection } from "@/components/SupportersSection";
import { supportersQuery, SupportersQueryResult } from "@/lib/cms/queries/supportersQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

export const metadata: Metadata = {
    title: "Support - aRPG Timeline",
    description:
        "Support aRPG Timeline via Patreon, Discord, or with our partners. Every contribution helps keep the site running.",
};

export default async function SupportPage() {
    const supporters: SupportersQueryResult = await sanityFetch({
        query: supportersQuery,
        revalidate: 3600,
    });
    return (
        <div className="relative container mx-auto mb-12">
            <div className="mx-auto max-w-prose">
                <h2 className="font-heading mx-auto mt-8 mb-6 text-center text-2xl">
                    Support aRPG Timeline
                </h2>
                <p className="text-muted-foreground mx-auto mb-8">
                    aRPG Timeline is a solo-developed, community-supported project - not affiliated
                    with any game studio or publisher. There are no intrusive ads; the site stays
                    running through Patreon support and partner deals. Every contribution, big or
                    small, goes directly into keeping it alive and improving.
                </p>
            </div>

            <div className="mx-auto max-w-4xl">
                <h3 className="font-heading mb-4 text-lg">Direct Support</h3>
                <div className="mb-12 flex flex-col gap-4">
                    <PatreonFunding />
                    <BuyMeACoffee />
                    <DiscordServerBoost />
                </div>

                <h3 className="font-heading mb-2 text-lg">Partner - Proton</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                    aRPG Timeline partners with Proton. Every signup through these links directly
                    supports the project and has a great deal for you.
                </p>
                <ProtonSupportCards />

                <div id="supporters" className="mt-12">
                    <h3 className="font-heading mb-4 text-lg">Supporters</h3>
                    <SupportersSection {...supporters} />
                </div>
            </div>
        </div>
    );
}
