import { toast } from "@/ui/hooks/useToast";

export const shareOnDiscord = (eventTitle: string, eventDate: Date) => {
  const unixTimestamp = Math.floor(eventDate.getTime() / 1000);
  const shareText = `${eventTitle} <t:${unixTimestamp}:R>`;
  navigator.clipboard.writeText(shareText).then(() => {
    toast({
      title: "Discord message copied",
      description: "Paste it on your channel of choise",
      withLogo: true,
      duration: 1000,
    });
  });
};
