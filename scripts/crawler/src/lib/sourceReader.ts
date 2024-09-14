import { XMLParser } from "fast-xml-parser";
import { FetchSource, SteamRssFeed, RedditRssFeed } from "./types";
import { extractGptPromptSnippet } from "./openAi";
import { isAtMost12HoursAgo } from "./time";
import { Response } from "node-fetch";

const extractMatches = (
  titles: string[],
  descriptions: string[],
  keywords: string[],
  crawlDescriptions: boolean,
): { match?: string; matchedItemIdx: number } => {
  let matchedItemIdx = -1;
  let keywordMatch = keywords.find((k, idx) => {
    const success = titles.some((title) =>
      title.toLowerCase().includes(k.toLowerCase()),
    );
    if (success) {
      matchedItemIdx = idx;
    }
    return success;
  });

  if (!keywordMatch && crawlDescriptions) {
    keywordMatch = keywords.find((k, idx) => {
      const success = descriptions.some((desc) =>
        desc.toLowerCase().includes(k.toLowerCase()),
      );
      if (success) {
        matchedItemIdx = idx;
      }
      return success;
    });
  }

  return { match: keywordMatch, matchedItemIdx };
};

const processSteamRssFeed = (
  source: FetchSource,
  keywords: string[],
  rssFeed: SteamRssFeed,
): Promise<{ match?: string; notes?: string; gptPrompt?: string }> => {
  if (!rssFeed.rss) throw new Error("Failed to parse RSS");

  const items = rssFeed.rss.channel.item;
  const titles = items.map((item) => item.title);
  const descriptions = items.map((item) => item.description);

  if (source.options?.notifyAboutNews) {
    const news = items
      .filter((item) => isAtMost12HoursAgo(new Date(item.pubDate)))
      .map((item) => ` - ${item.title}`);
    if (news.length > 0) {
      return Promise.resolve({
        notes: news.join("\n"),
        gptPrompt: extractGptPromptSnippet(descriptions[0], "") ?? undefined,
      });
    }
  }

  const { match, matchedItemIdx } = extractMatches(
    titles,
    descriptions,
    keywords,
    source.options?.crawlDescriptions ?? false,
  );

  return Promise.resolve({
    match,
    gptPrompt:
      extractGptPromptSnippet(items[matchedItemIdx]?.description, match) ??
      undefined,
  });
};

const processRedditRssFeed = (
  source: FetchSource,
  keywords: string[],
  rssFeed: RedditRssFeed,
): Promise<{ match?: string; notes?: string; gptPrompt?: string }> => {
  if (!rssFeed.feed) throw new Error("Failed to parse RSS");

  const items = rssFeed.feed.entry;
  const titles = items.map((item) => item.title);
  const descriptions = items.map((item) => item.content);

  if (source.options?.notifyAboutNews) {
    const news = items
      .filter((item) => isAtMost12HoursAgo(new Date(item.published)))
      .map((item) => ` - ${item.title}`);
    if (news.length > 0) {
      return Promise.resolve({
        notes: news.join("\n"),
        gptPrompt: extractGptPromptSnippet(descriptions[0], "") ?? undefined,
      });
    }
  }

  const { match, matchedItemIdx } = extractMatches(
    titles,
    descriptions,
    keywords,
    source.options?.crawlDescriptions ?? false,
  );

  return Promise.resolve({
    match,
    gptPrompt:
      extractGptPromptSnippet(items[matchedItemIdx]?.content, match) ??
      undefined,
  });
};

export const matchKeywordOrRss = async (
  source: FetchSource,
  keywords: string[],
  result: Response,
): Promise<{ match?: string; notes?: string; gptPrompt?: string }> => {
  const text = await result.text();

  if (!source.options?.rss) {
    const normalized = text.toLowerCase();
    const match = keywords.find((k) => normalized.includes(k.toLowerCase()));
    return {
      match,
      gptPrompt: text
        ? (extractGptPromptSnippet(text, match) ?? undefined)
        : undefined,
    };
  }

  const parser = new XMLParser();

  if (source.type === "crawlerSources_steam") {
    const rssFeed: SteamRssFeed = parser.parse(text);
    return processSteamRssFeed(source, keywords, rssFeed);
  } else if (source.type === "crawlerSources_reddit") {
    const rssFeed: RedditRssFeed = parser.parse(text);
    return processRedditRssFeed(source, keywords, rssFeed);
  } else {
    throw new Error("Unsupported RSS");
  }
};

