// lib/news-extractor/model-client.js
import OpenAI from "openai";

export class ModelClient {
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async extract(
    prompt: string,
    options: { model?: string; maxTokens?: number } = {}
  ) {
    try {
      const response = await this.openai.chat.completions.create({
        model: options.model || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1, // Lower temperature for more consistent extraction
      });
      console.log(response.usage);
      const result = JSON.parse(response?.choices[0]?.message?.content ?? "");
      result.modelUsed = options.model || "gpt-4o-mini";

      return result;
    } catch (error) {
      console.error("AI extraction failed:", error);
      throw new Error(`AI extraction failed: ${(error as Error)?.message}`);
    }
  }

  estimateTokens(text: string) {
    return Math.ceil(text.length / 4);
  }
}
