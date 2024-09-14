import OpenAI from "openai";
import he from "he";

export const GPT_PROMPT = `Your task is to identify a clear and explicit statement of a **season/league/cycle starting** date in the given game. You must **ignore any mention** of streams, content previews, events, developer updates, or anything else that does not specifically say that a season/league/cycle **is starting**. You are not allowed to infer or assume based on related activities like streams or content showcases.
If the text mentions a stream, event, or update but **does not directly state that a new season/league/cycle is starting**, respond with "Negative." Only respond with "Positive" if there is a direct statement of the season/league/cycle start date.
If a season/league/cycle start date is confirmed, respond with \`Positive, YYYY-MM-DDTHH:mm:ss.sssZ\` in the correct UTC format. Otherwise, respond with "Negative."`;

const openAiClient = new OpenAI();

export async function askGtpAboutLaunchDate(text: string): Promise<string> {
  const stream = await openAiClient.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      { role: "system", content: GPT_PROMPT },
      { role: "user", content: text },
    ],
    stream: true,
  });

  let result = "";
  for await (const chunk of stream) {
    result += chunk.choices[0]?.delta?.content || "";
  }
  return result;
}

const stripHtml = (html: string) => {
  const decodedHtml = he.decode(html);
  return decodedHtml.replace(/<[^>]*>/g, "");
};

export const extractGptPromptSnippet = (
  text: string | undefined,
  keyword: string | undefined,
): string | null => {
  if (!text) return null;

  if (!keyword) return text.slice(0, 500);

  const strippedText = stripHtml(text);

  const offset = 120;
  const keywordIndex = strippedText
    .toLowerCase()
    .indexOf(keyword.toLowerCase());
  const startIdx = Math.max(0, keywordIndex - offset);
  const endIdx = Math.min(
    strippedText.length,
    keywordIndex + keyword.length + offset,
  );

  return strippedText.slice(startIdx, endIdx);
};
