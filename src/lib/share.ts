import { toast } from "@/ui/hooks/useToast";
import { sa_event } from "@/lib/sa_event";

export const shareOnDiscord = (eventTitle: string, eventDate: Date) => {
  sa_event(`Share - Discord - ${eventTitle}}`);
  const unixTimestamp = Math.floor(eventDate.getTime() / 1000);
  const shareText = `${eventTitle} <t:${unixTimestamp}:R>`;
  navigator.clipboard.writeText(shareText).then(() => {
    toast({
      title: "Discord message copied",
      description: "Paste it into any Discord channel.",
      withLogo: true,
      duration: 3500,
    });
  });
};
