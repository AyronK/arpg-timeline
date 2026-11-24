import { GameCategory, GameFilterCategory } from "@/lib/cms/gameTags";

export type DashboardStatus =
    { kind: "visible" } | { kind: "hidden" } | { kind: "other-tab"; category: GameFilterCategory };

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

export const getHomeCategory = (categories: GameCategory[]): GameFilterCategory =>
    categories.includes("early-access")
        ? "early-access"
        : categories.includes("community")
          ? "community"
          : !categories.includes("seasonal")
            ? "non-seasonal"
            : "featured";

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
    return { kind: "other-tab", category: getHomeCategory(categories) };
};
