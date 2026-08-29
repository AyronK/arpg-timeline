/**
 * Strips emojis and URLs from a Steam news description so it renders as clean plain text.
 */
export function sanitizeNewsDescription(text: string): string {
    return text
        .replace(/\p{Extended_Pictographic}/gu, "")
        .replace(/[\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
        .replace(/https?:\/\/\S+/gi, "")
        .replace(/www\.\S+/gi, "")
        .replace(/\s+/g, " ")
        .trim();
}
