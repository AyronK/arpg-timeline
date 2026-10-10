// Adds or strips `nofollow` from a rel string, keeping the other tokens.
export function applyFollowPolicy(rel: string | undefined, follow: boolean): string | undefined {
    const tokens = (rel ?? "").split(/\s+/).filter((t) => t && t.toLowerCase() !== "nofollow");
    if (!follow) tokens.push("nofollow");
    return tokens.length ? tokens.join(" ") : undefined;
}
