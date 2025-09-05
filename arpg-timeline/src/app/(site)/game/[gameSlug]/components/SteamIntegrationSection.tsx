import { SteamDBEmbed } from "@/components/SteamDBEmbed";
import { SteamEmbed } from "@/components/SteamEmbed";
import { SteamNews } from "@/components/SteamNews";

import { SteamIntegrationSectionProps } from "../types";

export const SteamIntegrationSection = ({
    steamAppId,
    steamNews,
}: SteamIntegrationSectionProps) => (
    <div className="space-y-6 md:gap-6 md:space-y-8">
        <h2 className="font-heading text-2xl md:text-3xl">Steam Integration</h2>
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="md:bg-card md:text-card-foreground md:rounded-lg md:border md:p-4">
                    <h3 className="font-heading mb-3 text-lg">Steam Store</h3>
                    <SteamEmbed appId={steamAppId} />
                </div>
                <div className="md:bg-card md:text-card-foreground md:rounded-lg md:border md:p-4">
                    <h3 className="font-heading mb-3 text-lg">SteamDB Stats</h3>
                    <SteamDBEmbed appId={steamAppId} />
                </div>
            </div>
            <SteamNews steamAppId={steamAppId} news={steamNews} />
        </div>
    </div>
);
