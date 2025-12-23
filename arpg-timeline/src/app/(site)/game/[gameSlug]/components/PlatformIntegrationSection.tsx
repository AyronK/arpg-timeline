import { CalendarSubscriptionAlert } from "@/components/CalendarSubscriptionAlert";
import { GameNews } from "@/components/GameNews";
import { PatreonFunding } from "@/components/PatreonFunding";
import { SteamDBEmbed } from "@/components/SteamDBEmbed";
import { SteamEmbed } from "@/components/SteamEmbed";
import { cn } from "@/lib/utils";

import { PlatformIntegrationSectionProps } from "../types";

export const PlatformIntegrationSection = ({
    steamAppId,
    gameNews,
    gameSlug,
    gameName,
}: PlatformIntegrationSectionProps) => (
    <div className="space-y-6 md:gap-6 md:space-y-8">
        <h2 className="font-heading text-2xl md:text-3xl">Live updates</h2>
        <div
            className={cn("grid gap-4 md:gap-6 lg:grid-cols-2", { "lg:grid-cols-1": !steamAppId })}
        >
            {steamAppId && (
                <div className="flex flex-1 flex-col justify-between gap-4">
                    <PatreonFunding />
                    <div className="md:bg-card md:text-card-foreground md:rounded-lg md:border md:p-4">
                        <h3 className="font-heading mb-3 text-lg">Steam Store</h3>
                        <SteamEmbed appId={steamAppId} />
                    </div>
                    <div className="md:bg-card md:text-card-foreground md:rounded-lg md:border md:p-4">
                        <h3 className="font-heading mb-3 text-lg">SteamDB Stats</h3>
                        <SteamDBEmbed appId={steamAppId} />
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-4 md:gap-6">
                <CalendarSubscriptionAlert gameSlug={gameSlug} gameName={gameName} />
                <GameNews steamAppId={steamAppId} news={gameNews} />
            </div>
        </div>
    </div>
);
