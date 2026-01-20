import { addUTMParameters } from "@/lib/utm";

export const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_content: "discord_embed",
    utm_campaign: "website_update_notification",
    utm_medium: "discord",
});
