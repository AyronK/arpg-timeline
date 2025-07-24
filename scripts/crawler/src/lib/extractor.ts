// lib/news-extractor/extractor.js
import { preprocessHTML, generateContentHash } from "./html-processor.js";
import { ModelClient } from "./model-client.js";
import { CacheManager } from "./cache.js";

export class NewsExtractor {
  modelClient: ModelClient;
  cache: CacheManager;
  dailyCost: number;
  maxDailyCost: number;
  constructor() {
    this.modelClient = new ModelClient();
    this.cache = new CacheManager();
    this.dailyCost = 0;
    this.maxDailyCost = parseFloat(process.env.MAX_DAILY_AI_COST || "50");
  }

  async extractAllEntries({
    html,
    sourceUrl,
  }: {
    html: string;
    sourceUrl: string;
  }) {
    const preprocessed = preprocessHTML(html);

    if (preprocessed.tokenEstimate > 5000) {
      console.warn(
        `Large content detected: ${preprocessed.tokenEstimate} tokens`
      );
      preprocessed.content = preprocessed.content.substring(0, 5000);
    }

    if (preprocessed.contentLength < 500) {
      return {
        entries: [],
        pageType: "error",
        totalFound: 0,
        error: "Insuffucient content",
      };
    }

    const prompt = `
You are extracting multiple news articles, forum threads, or blog posts from a webpage. This could be:
- A news homepage with multiple article links
- A forum index with multiple thread titles
- A blog homepage with multiple post previews
- A Reddit-style listing
- Any other multi-entry content page
- Entries are usually gathered in a table, so if you find a table, prioritize that and skip everything outside it

Today is ${new Date().toISOString()}. Extract the first 5 most recent (by publish date or if not available, by occurrance order) individual entries from this HTML. For each entry, find:
- Title/headline of the individual item
- URL link to the full article/thread
- Any preview text, description, or intro
- Publication date if available

Return JSON:
{
  "entries": [
    {
      "headline": "title of individual item",
      "url": "link to full article/thread (make absolute URLs)",
      "intro": "preview text, description, or first sentence",
      "publishDate": "ISO date string or null",
      "contentType": "article|forum_post|blog_post|other",
    }
  ],
  "pageType": "news_homepage|forum_index|blog_listing|other",
  "totalFound": number
}

HTML Content:
${preprocessed.content}

Base URL for resolving relative links: ${sourceUrl}

Instructions:
- Make ALL URLs absolute (add domain if missing)
- If no intro/description, use first few words from title or set to null
- Detect content type based on page structure and metadata
- Extract at most 5 entries
- Skip navigation links, ads, or non-content items
`;

    try {
      const response = await this.modelClient.extract(prompt, {
        model: "gpt-4o-mini",
        maxTokens: 2000,
      });

      // Post-process to ensure data quality
      if (response.entries) {
        response.entries = response.entries
          .map((entry: any) => this.cleanEntry({ entry, sourceUrl }))
          .filter((entry: any) => entry.url && entry.headline); // Only keep valid entries
      }

      return {
        entries: response.entries || [],
        pageType: response.pageType || "other",
        totalFound: response.totalFound || response.entries?.length || 0,
        modelUsed: "gpt-4o-mini",
      };
    } catch (error) {
      console.error("Multi-entry extraction failed:", error);
      return {
        entries: [],
        pageType: "error",
        totalFound: 0,
        error: (error as Error)?.message,
      };
    }
  }

  cleanEntry({ entry, sourceUrl }: { entry: any; sourceUrl: string }) {
    return {
      headline: entry.headline?.trim() || null,
      url: this.resolveUrl(entry.url, sourceUrl),
      intro: entry.intro?.trim() || null,
      publishDate: this.parseDate(entry.publishDate),
      contentType: entry.contentType || "article",
    };
  }

  resolveUrl(url: string, baseUrl: string) {
    if (!url) return null;

    try {
      // Already absolute URL
      if (url.startsWith("http")) return url;

      // Protocol-relative URL
      if (url.startsWith("//")) return `https:${url}`;

      // Absolute path
      if (url.startsWith("/")) {
        const base = new URL(baseUrl);
        return `${base.protocol}//${base.host}${url}`;
      }

      // Relative path
      const base = new URL(baseUrl);
      return `${base.protocol}//${base.host}${
        base.pathname.endsWith("/") ? base.pathname : base.pathname + "/"
      }${url}`;
    } catch (error) {
      console.error("URL resolution failed:", { url, baseUrl, error });
      return null;
    }
  }

  parseDate(dateString: string) {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date.toISOString();
    } catch (error) {
      return null;
    }
  }

  estimateCost(tokens: number, model: "gpt-3.5-turbo" | "gpt-4o-mini") {
    const rates = {
      "gpt-3.5-turbo": 0.0015 / 1000,
      "gpt-4o-mini": 0.00015 / 1000,
    };
    return tokens * (rates[model] || 0.002);
  }
}
