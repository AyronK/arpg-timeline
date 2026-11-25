import { GameCategory, GameFilterCategory } from "@/lib/cms/gameTags";

export type DashboardStatus = { kind: "visible" } | { kind: "hidden" } | { kind: "other-tab" };

const belongsTo = (categories: GameCategory[], category: GameFilterCategory) => {
    switch (category) {
        case "featured":
        case "all":
            return true;
        case "non-seasonal":
            return !categories.includes("seasonal");
        case "community":
            return categories.includes("community");
        case "early-access":
            return categories.includes("early-access");
    }
};

export const getDashboardStatus = ({
    slug,
    categories,
    category,
    visibleSlugs,
}: {
    slug: string;
    categories: GameCategory[];
    category: GameFilterCategory;
    visibleSlugs: Set<string>;
}): DashboardStatus => {
    if (visibleSlugs.has(slug)) {
        return { kind: "visible" };
    }
    if (belongsTo(categories, category)) {
        return { kind: "hidden" };
    }
    return { kind: "other-tab" };
};
