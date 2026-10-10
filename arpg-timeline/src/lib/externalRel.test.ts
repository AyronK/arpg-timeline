import { describe, expect, it } from "vitest";

import { applyFollowPolicy } from "./externalRel";

describe("applyFollowPolicy", () => {
    it("strips nofollow when followed", () => {
        expect(applyFollowPolicy("noopener noreferrer nofollow", true)).toBe("noopener noreferrer");
    });

    it("adds nofollow when not followed", () => {
        expect(applyFollowPolicy("noopener noreferrer", false)).toBe(
            "noopener noreferrer nofollow",
        );
    });

    it("does not duplicate nofollow", () => {
        expect(applyFollowPolicy("nofollow noopener", false)).toBe("noopener nofollow");
    });

    it("returns undefined for an empty followed rel", () => {
        expect(applyFollowPolicy(undefined, true)).toBeUndefined();
        expect(applyFollowPolicy("nofollow", true)).toBeUndefined();
    });

    it("returns nofollow alone for an empty unfollowed rel", () => {
        expect(applyFollowPolicy(undefined, false)).toBe("nofollow");
    });
});
