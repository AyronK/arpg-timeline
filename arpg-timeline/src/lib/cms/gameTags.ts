// Dashboard Tags - for controlling visibility and categorization
export type DashboardTag =
    | "default"
    | "default-when-next-confirmed"
    | "other"
    | "community"
    | "seasonal"
    | "early-access";

// Main Game Tags - comprehensive game features and characteristics
export type GameTag =
    // Play modes
    | "playmode-online"
    | "playmode-offline"

    // Player count
    | "players-single"
    | "players-multi"

    // Cooperation types
    | "coop-online"
    | "coop-couch"

    // Game modes
    | "gamemode-hc"
    | "gamemode-ngp"
    | "gamemode-pve"
    | "gamemode-pvp"

    // Economy features
    | "economy-trade"
    | "economy-ssf"
    | "economy-auction-house"

    // Device support
    | "device-controller"
    | "device-steamdeck-verified"
    | "device-steamdeck-playable"
    | "device-mobile"

    // Update frequency
    | "updates-seasonal"
    | "updates-expansions"
    | "updates-live-service"

    // Content
    | "content-campaign"
    | "content-endgame"
    | "content-seasonal"
    | "content-events"
    | "content-community-events"
    | "content-procedural-areas"

    // Monetization model
    | "monetization-f2p"
    | "monetization-paid-ea-f2p"
    | "monetization-base-paid"
    | "monetization-mtx"
    | "monetization-supporter-packs"
    | "monetization-paid-expansions"
    | "monetization-season-pass"
    | "monetization-subscription"
    | "monetization-loot-boxes"
    | "monetization-cosmetic-loot-boxes"
    | "monetization-p2w"
    | "monetization-character-slots"
    | "monetization-pay-for-convenience";

export const DASHBOARD_TAGS = [
    "default",
    "default-when-next-confirmed",
    "other",
    "community",
    "seasonal",
    "early-access",
] satisfies DashboardTag[];

// Tag Categories for easier filtering and grouping
export const TAG_CATEGORIES = {
    PLAY_MODES: ["playmode-online", "playmode-offline"] satisfies readonly GameTag[],
    PLAYER_COUNT: ["players-single", "players-multi"] satisfies readonly GameTag[],
    COOPERATION: ["coop-online", "coop-couch"] satisfies readonly GameTag[],
    GAME_MODES: [
        "gamemode-hc",
        "gamemode-ngp",
        "gamemode-pve",
        "gamemode-pvp",
    ] satisfies readonly GameTag[],
    ECONOMY: ["economy-trade", "economy-ssf", "economy-auction-house"] satisfies readonly GameTag[],
    DEVICE_SUPPORT: [
        "device-controller",
        "device-steamdeck-verified",
        "device-steamdeck-playable",
        "device-mobile",
    ] satisfies readonly GameTag[],
    UPDATES: [
        "updates-seasonal",
        "updates-expansions",
        "updates-live-service",
    ] satisfies readonly GameTag[],
    CONTENT: [
        "content-campaign",
        "content-endgame",
        "content-seasonal",
        "content-events",
        "content-community-events",
        "content-procedural-areas",
    ] satisfies readonly GameTag[],
    MONETIZATION: [
        "monetization-f2p",
        "monetization-paid-ea-f2p",
        "monetization-base-paid",
        "monetization-mtx",
        "monetization-supporter-packs",
        "monetization-paid-expansions",
        "monetization-season-pass",
        "monetization-subscription",
        "monetization-loot-boxes",
        "monetization-cosmetic-loot-boxes",
        "monetization-p2w",
        "monetization-character-slots",
        "monetization-pay-for-convenience",
    ] satisfies readonly GameTag[],
};

// Type for tag categories
export type TagCategory = keyof typeof TAG_CATEGORIES;

// Helper types
export type DashboardTagValue = DashboardTag;
export type GameTagValue = GameTag;

// Game interface with tags
export interface GameWithTags {
    _id: string;
    name: string;
    slug: string;
    dashboardTags?: DashboardTagValue[];
    tags?: GameTagValue[];
    // ... other game properties
}

// Utility functions for working with tags
export const getTagsByCategory = (category: TagCategory): readonly GameTagValue[] => {
    return TAG_CATEGORIES[category];
};

export const isTagInCategory = (tag: GameTagValue, category: TagCategory): boolean => {
    return (TAG_CATEGORIES[category] as readonly GameTagValue[]).includes(tag);
};

export const getTagCategory = (tag: GameTagValue): TagCategory | null => {
    for (const [category, tags] of Object.entries(TAG_CATEGORIES)) {
        if ((tags as readonly GameTagValue[]).includes(tag)) {
            return category as TagCategory;
        }
    }
    return null;
};

// Filter games by tags
export const filterGamesByTag = <T extends GameWithTags>(games: T[], tag: GameTagValue): T[] => {
    return games.filter((game) => game.tags?.includes(tag));
};

export const filterGamesByTags = <T extends GameWithTags>(
    games: T[],
    tags: GameTagValue[],
    requireAll: boolean = false,
): T[] => {
    if (requireAll) {
        return games.filter((game) => tags.every((tag) => game.tags?.includes(tag)));
    } else {
        return games.filter((game) => tags.some((tag) => game.tags?.includes(tag)));
    }
};

// Filter games by dashboard tags
export const filterGamesByDashboardTag = <T extends GameWithTags>(
    games: T[],
    dashboardTag: DashboardTagValue,
): T[] => {
    return games.filter((game) => game.dashboardTags?.includes(dashboardTag));
};

// Get all unique tags from a list of games
export const getAllUniqueTags = (games: GameWithTags[]): GameTagValue[] => {
    const tagSet = new Set<GameTagValue>();
    games.forEach((game) => {
        game.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
};

// Get tag counts for analytics
export const getTagCounts = (games: GameWithTags[]): Record<GameTagValue, number> => {
    const counts: Record<GameTagValue, number> = {} as Record<GameTagValue, number>;

    games.forEach((game) => {
        game.tags?.forEach((tag) => {
            counts[tag] = (counts[tag] || 0) + 1;
        });
    });

    return counts;
};

// Get dashboard tag counts
export const getDashboardTagCounts = (games: GameWithTags[]): Record<DashboardTagValue, number> => {
    const counts: Record<DashboardTagValue, number> = {} as Record<DashboardTagValue, number>;

    games.forEach((game) => {
        game.dashboardTags?.forEach((tag) => {
            counts[tag] = (counts[tag] || 0) + 1;
        });
    });

    return counts;
};

// Type guards
export const isGameTag = (value: string): value is GameTag => {
    const allTags = Object.values(TAG_CATEGORIES).flat();
    return allTags.includes(value as GameTag);
};

export const isDashboardTag = (value: string): value is DashboardTag => {
    const dashboardTags: DashboardTag[] = [
        "default",
        "default-when-next-confirmed",
        "other",
        "community",
        "seasonal",
        "early-access",
    ];
    return dashboardTags.includes(value as DashboardTag);
};
