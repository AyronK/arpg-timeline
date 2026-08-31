export function parseYouTubeId(url: string | undefined | null): string | null {
    if (!url) return null;

    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return null;
    }

    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
        const id = parsed.pathname.slice(1).split("/")[0];
        return isValidId(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
        const v = parsed.searchParams.get("v");
        if (isValidId(v)) return v;

        const match = parsed.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
        if (match && isValidId(match[1])) return match[1];
    }

    return null;
}

function isValidId(id: string | null | undefined): id is string {
    return typeof id === "string" && /^[a-zA-Z0-9_-]{11}$/.test(id);
}

export const getYouTubeEmbedUrl = (id: string): string =>
    `https://www.youtube-nocookie.com/embed/${id}`;
