import { sa_event } from "@/lib/sa_event";
import { addUTMParameters } from "@/lib/utm";
import { toast } from "@/ui/hooks/useToast";

import { formatDiscordDate } from "./discord/formatDiscordDate";

export const shareOnDiscord = (eventTitle: string, eventDate: Date) => {
    sa_event(`Share - Discord - ${eventTitle}}`);

    const baseUrl = window.location.href;
    const addUTM = addUTMParameters({
        utm_source: "discord",
        utm_medium: "share",
        utm_campaign: "event_widget",
        utm_content: "eventTitle",
    });

    const url = addUTM(baseUrl);

    const shareText = `📅 ${eventTitle}\n⏰ Starts ${formatDiscordDate(eventDate)}\n🔗 ${url}`;

    navigator.clipboard.writeText(shareText).then(() => {
        toast({
            title: "Discord message copied",
            description: "Paste it into any Discord channel.",
            withLogo: true,
            duration: 3500,
        });
    });
};
