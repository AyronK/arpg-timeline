import fetch from "node-fetch";
import { Notification } from "./types";

const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL as string;

const formatNotification = (notification: Notification, idx: number): string =>
  `*🔹 Notification #${idx + 1}*\n${notification.text}`;

export const sendDiscordNotification = async (
  notifications: Notification[],
): Promise<void> => {
  const importantNotifications = notifications.filter(
    (n) => n.type !== "trace",
  );

  if (importantNotifications.length === 0) {
    try {
      const response = await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "aRPG Timeline Crawler",
          content: `🔇 *Crawler successfully checked ${notifications.length} sources without any match*`,
        }),
      });
      if (response.ok) {
        console.log("✅ Posted message to Discord!");
      } else {
        const errorText = await response.text();
        console.error("❌ Failed to send a message to Discord:", errorText);
      }
    } catch (e) {
      console.error("❌ Failed to send a message to Discord", e);
      throw e;
    }
    return;
  }

  for (let idx = 0; idx < importantNotifications.length; idx++) {
    const content = `⚠️ **Crawler Alert** @here\n\n${formatNotification(importantNotifications[idx], idx)}`;

    try {
      const response = await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "aRPG Timeline Crawler",
          content,
        }),
      });
      if (response.ok) {
        console.log(`✅ Posted Notification #${idx + 1} to Discord!`);
      } else {
        const errorText = await response.text();
        console.error(
          `❌ Failed to send Notification #${idx + 1} to Discord:`,
          errorText,
        );
      }
    } catch (e) {
      console.error(`❌ Failed to send Notification #${idx + 1} to Discord`, e);
      throw e;
    }
  }
};
