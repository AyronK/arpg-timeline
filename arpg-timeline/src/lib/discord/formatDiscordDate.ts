export function formatDiscordDate(date: Date, type: "R" | "f" = "R"): string {
    const timestamp = Math.floor(date.getTime() / 1000);
    return `<t:${timestamp}:${type}>`;
}
