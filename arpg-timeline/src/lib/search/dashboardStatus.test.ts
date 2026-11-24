import { describe, expect, it } from "vitest";

import { GameCategory, GameFilterCategory } from "@/lib/cms/gameTags";

import { getDashboardStatus } from "./dashboardStatus";

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

    it("is on another tab when the game does not belong here", () => {
        expect(status(["seasonal"], "community")).toEqual({ kind: "other-tab" });
        expect(status(["community", "seasonal"], "early-access")).toEqual({ kind: "other-tab" });
        expect(status([], "early-access")).toEqual({ kind: "other-tab" });
    });
});
