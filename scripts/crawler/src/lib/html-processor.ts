import crypto from "crypto";
import { minify } from "html-minifier";

export function preprocessHTML(html: string) {
  // Remove noise elements
  const cleanHTML = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<nav\b[^>]*>.*?<\/nav>/gi, "")
    .replace(/<img[^\>]*>/gi, "")
    .replace(/<svg\b[^>]*>.*?<\/svg>/gi, "")
    .replace(/<header\b[^>]*>.*?<\/header>/gi, "")
    .replace(/<footer\b[^>]*>.*?<\/footer>/gi, "")
    .replace(/<aside\b[^>]*>.*?<\/aside>/gi, "")
    .replace(/class="[^"]*"/gi, "")
    .replace(/id="[^"]*"/gi, "")
    .replace(/style="[^"]*"/gi, "")
    .replace(/title="[^"]*"/gi, "")
    .replace(" >", ">");

  // Extract content blocks
  const contentBlocks = extractContentBlocks(cleanHTML);

  // Minify
  const minified = minify(contentBlocks, {
    removeComments: true,
    removeEmptyAttributes: true,
    collapseWhitespace: true,
  });

  return {
    content: minified,
    tokenEstimate: estimateTokens(minified),
    contentLength: minified.length,
  };
}

export function generateContentHash(url: string, html: string) {
  const normalizedContent = html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .substring(0, 500);

  return crypto
    .createHash("md5")
    .update(url + normalizedContent)
    .digest("hex");
}

function extractContentBlocks(html: string) {
  const contentSelectors = [
    /<noscript[^>]*>(.*?)<\/noscript>/gi,
    /<table[^>]*>(.*?)<\/table>/gi,
    /<article[^>]*>(.*?)<\/article>/gi,
    /<main[^>]*>(.*?)<\/main>/gi,
    /<div[^>]*>(.*?)<\/div>/gi,
  ];

  let extractedContent = "";
  for (const selector of contentSelectors) {
    const matches = html.match(selector);
    if (matches) {
      extractedContent += matches.join(" ");
    }
  }

  return extractedContent || html;
}

function estimateTokens(text: string) {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}
