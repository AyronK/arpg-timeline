import { describe, expect, it } from "vitest";

import { getYouTubeEmbedUrl, parseYouTubeId } from "./youtube";

describe("parseYouTubeId", () => {
    it("parses watch URLs", () => {
        expect(parseYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
        expect(parseYouTubeId("https://youtube.com/watch?v=dQw4w9WgXcQ&t=42")).toBe("dQw4w9WgXcQ");
    });

    it("parses short, embed, shorts and live URLs", () => {
        expect(parseYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
        expect(parseYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
        expect(parseYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
        expect(parseYouTubeId("https://www.youtube.com/live/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("returns null for non-YouTube or malformed URLs", () => {
        expect(parseYouTubeId("https://vimeo.com/12345")).toBeNull();
        expect(parseYouTubeId("https://twitch.tv/clip/abc")).toBeNull();
        expect(parseYouTubeId("not a url")).toBeNull();
        expect(parseYouTubeId("")).toBeNull();
        expect(parseYouTubeId(undefined)).toBeNull();
        expect(parseYouTubeId("https://www.youtube.com/watch?v=tooShort")).toBeNull();
    });
});

describe("getYouTubeEmbedUrl", () => {
    it("uses the privacy-enhanced host", () => {
        expect(getYouTubeEmbedUrl("dQw4w9WgXcQ")).toBe(
            "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        );
    });
});
