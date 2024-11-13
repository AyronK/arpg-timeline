import fetch from "node-fetch";
import { Notification } from "./types";

const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL as string;

const formatNotifications = (notifications: Notification[]): string => {
  const importantNotifications = notifications.filter(
    (n) => n.type !== "trace",
  );
  if (importantNotifications.length === 0) {
    return `🔇 *Crawler successfully checked ${notifications.length} sources without any match*`;
  }

  const parsedNotifications = importantNotifications
    .map((n, idx) => `*🔹 Notification #${idx + 1}*\n ${n.text}`)
    .join("\n\n");

  return `⚠️ **Crawler got ${importantNotifications.length} alert(s)** @here\n\n${parsedNotifications}`;
};

export const sendDiscordNotification = async (
  notifications: Notification[],
): Promise<void> => {
  const content = formatNotifications(notifications);

  try {
    const response = await fetch(discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "aRPG Timeline Crawler",
        content,
      }),
    });
    if(response.ok) {
      console.log("✅ Posted message to Discord!");
    } else {
      const errorText = await response.text();
      console.error("❌ Failed to send a message to Discord:", errorText);
    }
  } catch (e) {
    console.error("❌ Failed to send a message to Discord", e);
    throw e;
  }
};
