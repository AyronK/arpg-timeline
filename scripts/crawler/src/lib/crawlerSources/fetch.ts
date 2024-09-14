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
        text: `❌ **${game.name}**: Failed to fetch data from \`${source.url}\`: ${result.status} - ${result.statusText}`,
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
            ? ` GPT comment on the most recent RSS entry: \`${gptComment}\``
            : ""),
      };
    } else if (match) {
      return {
        type: "warn",
        game: game.name,
        text:
          `🔍 **${game.name}**: \`${match}\` keyword match on \`${source.url}\`.` +
          (gptComment
            ? ` GPT comment on matched RSS entry: \`${gptComment}\``
            : ""),
      };
    } else {
      return {
        type: "trace",
        game: game.name,
        text: `🔇 **${game.name}**: Nothing found on \`${source.url}\``,
      };
    }
  } catch (error) {
    return {
      type: "error",
      game: game.name,
      text: `❌ **${game.name}**: Error fetching data from \`${source.url}\`: ${(error as Error).message}`,
    };
  }
};
