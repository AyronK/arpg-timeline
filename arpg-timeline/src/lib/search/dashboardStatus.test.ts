import { describe, expect, it } from "vitest";

import { GameCategory, GameFilterCategory } from "@/lib/cms/gameTags";

import { getDashboardStatus, getHomeCategory } from "./dashboardStatus";

const status = (categories: GameCategory[], category: GameFilterCategory, visible = false) =>
    getDashboardStatus({
        slug: "game",
        categories,
        category,
        visibleSlugs: new Set(visible ? ["game"] : []),
    });

describe("getDashboardStatus", () => {
    it("is visible when the dashboard shows the game", () => {
        expect(status(["seasonal"], "featured", true)).toEqual({ kind: "visible" });
        expect(status(["community"], "all", true)).toEqual({ kind: "visible" });
    });

    it("is hidden when the game belongs to this tab but is filtered out", () => {
        expect(status(["seasonal"], "featured")).toEqual({ kind: "hidden" });
        expect(status(["community", "seasonal"], "featured")).toEqual({ kind: "hidden" });
        expect(status(["community"], "community")).toEqual({ kind: "hidden" });
    });

    it("points to the game's own tab when it does not belong here", () => {
        expect(status(["seasonal"], "community")).toEqual({
            kind: "other-tab",
            category: "featured",
        });
        expect(status(["community", "seasonal"], "early-access")).toEqual({
            kind: "other-tab",
            category: "community",
        });
        expect(status([], "early-access")).toEqual({
            kind: "other-tab",
            category: "non-seasonal",
        });
    });
});

describe("getHomeCategory", () => {
    it("prefers early access, then community, then non-seasonal, then featured", () => {
        expect(getHomeCategory(["early-access", "community"])).toBe("early-access");
        expect(getHomeCategory(["community", "seasonal"])).toBe("community");
        expect(getHomeCategory([])).toBe("non-seasonal");
        expect(getHomeCategory(["seasonal"])).toBe("featured");
    });
});
