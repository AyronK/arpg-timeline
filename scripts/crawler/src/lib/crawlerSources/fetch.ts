import fetch from "node-fetch";
import { askGtpAboutLaunchDate } from "../openAi";
import { matchKeywordOrRss } from "../sourceReader";
import { Game, FetchSource } from "../types";
import { withTimeout } from "../withTimeout";
import { Notification } from "../types";
export const fetchSourceNotifications = async (
  game: Game,
  source: FetchSource,
  keywords: string[],
): Promise<Notification> => {
  try {
    const result = await withTimeout(fetch(source.url), 5000);

    if (!result.ok) {
      return {
        type: "error",
        game: game.name,
        text: `❌ **${game.name}**: Failed to fetch data from ${source.url}\nStatus: ${result.status} - ${result.statusText}`,
      };
    }

    const { match, notes, gptPrompt } = await matchKeywordOrRss(
      source,
      keywords,
      result,
    );
    let gptComment = "";
    if (gptPrompt && (notes || match)) {
      gptComment = await askGtpAboutLaunchDate(gptPrompt);
    }

    if (notes) {
      return {
        type: "warn",
        game: game.name,
        text:
          `📡 **${game.name}**: New RSS messages:\n${notes}` +
          (gptComment
            ? `\n\n**Text snippet:**\n> ${gptPrompt}\n\n**GPT's assert for the snippet:**\n> ${gptComment}`
            : ""),
      };
    } else if (match) {
      return {
        type: "warn",
        game: game.name,
        text:
          `🔍 **${game.name}**: Keyword match: \`${match}\`\n${source.url}` +
          (gptComment
            ? `\n\n**Text snippet:**\n> ${gptPrompt}\n\n**GPT's assert for the snippet:**\n> ${gptComment}`
            : ""),
      };
    } else {
      return {
        type: "trace",
        game: game.name,
        text: `🔇 **${game.name}**: Nothing found on ${source.url}`,
      };
    }
  } catch (error) {
    return {
      type: "error",
      game: game.name,
      text: `❌ **${game.name}**: Error fetching data from ${source.url}\n> ${(error as Error).message}`,
    };
  }
};
