import { sa_event } from "@/lib/sa_event";
import { toast } from "@/ui/hooks/useToast";

import { formatDiscordDate } from "./discord/formatDiscordDate";

export const shareOnDiscord = (eventTitle: string, eventDate: Date) => {
    sa_event(`Share - Discord - ${eventTitle}}`);

    const baseUrl = window.location.href;
    const url = new URL(baseUrl);
    url.searchParams.set("utm_source", "discord");
    url.searchParams.set("utm_medium", "share");
    url.searchParams.set("utm_campaign", "event_widget");

    const shareText = `📅 ${eventTitle}\n⏰ Starts ${formatDiscordDate(eventDate)}\n🔗 ${url.toString()}`;

    navigator.clipboard.writeText(shareText).then(() => {
        toast({
            title: "Discord message copied",
            description: "Paste it into any Discord channel.",
            withLogo: true,
            duration: 3500,
        });
    });
};
