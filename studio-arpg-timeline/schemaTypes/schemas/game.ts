import { ALL_FIELDS_GROUP, defineField, defineType, type Rule } from "sanity";
export default defineType({
    name: "game",
    title: "Game",
    type: "document",
    groups: [
        { name: "main", title: "Main", default: true },
        { name: "platforms", title: "Platforms" },
        { name: "toggles", title: "Toggles" },
        {
            ...ALL_FIELDS_GROUP,
            hidden: true,
        },
    ],
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
            group: "main",
        },
        {
            name: "shortName",
            title: "Short name",
            type: "string",
            group: "main",
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
            validation: (Rule: Rule) => Rule.required(),
            group: "main",
        },
        {
            name: "dashboardTags",
            title: "Dashboard Tags",
            description: "Select one or more tags to categorize this game",
            type: "array",
            of: [
                {
                    type: "string",
                    options: {
                        list: [
                            { title: "Show in the default section", value: "default" },
                            {
                                title: "Show in the default section only if next update is confirmed",
                                value: "default-when-next-confirmed",
                            },
                            { title: 'Show in the "You may also like" section', value: "other" },
                            { title: "Community Driven", value: "community" },
                            { title: "Seasonal", value: "seasonal" },
                            { title: "Early access", value: "early-access" },
                        ],
                    },
                },
            ],
            options: {
                layout: "list",
            },
            group: "main",
        },
        {
            name: "tags",
            title: "Tags",
            description: "Select one or more tags to categorize this game",
            type: "array",
            of: [
                {
                    type: "string",
                    options: {
                        list: [
                            // Play modes
                            { title: "🎮 Play mode: Online", value: "playmode-online" },
                            { title: "🎮 Play mode: Offline", value: "playmode-offline" },

                            // Player count
                            { title: "👥 Player count: Single player", value: "players-single" },
                            { title: "👥 Player count: Multi player", value: "players-multi" },

                            // Cooperation types
                            { title: "🤝 Cooperation: Online coop", value: "coop-online" },
                            { title: "🤝 Cooperation: Couch coop", value: "coop-couch" },

                            // Game modes
                            { title: "⚔️ Game mode: Hardcore Mode", value: "gamemode-hc" },
                            { title: "⚔️ Game mode: New Game +", value: "gamemode-ngp" },
                            { title: "⚔️ Game mode: PvE", value: "gamemode-pve" },
                            { title: "⚔️ Game mode: PvP", value: "gamemode-pvp" },
                            { title: "⚔️ Game mode: Roguelike", value: "gamemode-roguelike" },
                            { title: "⚔️ Game mode: Roguelite", value: "gamemode-roguelite" },

                            // Economy features
                            {
                                title: "💰 Economy: Trade with other players",
                                value: "economy-trade",
                            },
                            { title: "💰 Economy: Solo self found", value: "economy-ssf" },
                            { title: "💰 Economy: Auction house", value: "economy-auction-house" },

                            // Device support
                            { title: "📱 Device: Controller support", value: "device-controller" },
                            {
                                title: "📱 Device: Steamdeck verified",
                                value: "device-steamdeck-verified",
                            },
                            {
                                title: "📱 Device: Steamdeck playable",
                                value: "device-steamdeck-playable",
                            },
                            { title: "📱 Device: Mobile support", value: "device-mobile" },

                            // Update frequency
                            { title: "🔄 Updates: Seasonal updates", value: "updates-seasonal" },
                            { title: "🔄 Updates: Major expansions", value: "updates-expansions" },
                            { title: "🔄 Updates: Live service", value: "updates-live-service" },

                            // Content
                            { title: "📚 Content: Story/campaign", value: "content-campaign" },
                            { title: "📚 Content: Endgame systems", value: "content-endgame" },
                            { title: "📚 Content: Seasonal content", value: "content-seasonal" },
                            { title: "📚 Content: Official events", value: "content-events" },
                            {
                                title: "📚 Content: Community events",
                                value: "content-community-events",
                            },
                            {
                                title: "📚 Content: Procedurally generated area",
                                value: "content-procedural-areas",
                            },

                            // Monetization model
                            { title: "💳 Monetization: Free to play", value: "monetization-f2p" },
                            {
                                title: "💳 Monetization: Paid Early Access into Free to play",
                                value: "monetization-paid-ea-f2p",
                            },
                            {
                                title: "💳 Monetization: Base game paid",
                                value: "monetization-base-paid",
                            },
                            {
                                title: "💳 Monetization: Microtransactions",
                                value: "monetization-mtx",
                            },
                            {
                                title: "💳 Monetization: Supporter packs",
                                value: "monetization-supporter-packs",
                            },
                            {
                                title: "💳 Monetization: Paid expansions",
                                value: "monetization-paid-expansions",
                            },
                            {
                                title: "💳 Monetization: Paid character classes",
                                value: "monetization-paid-classes",
                            },
                            {
                                title: "💳 Monetization: Season passes",
                                value: "monetization-season-pass",
                            },
                            {
                                title: "💳 Monetization: Subscription model",
                                value: "monetization-subscription",
                            },
                            {
                                title: "💳 Monetization: Loot boxes",
                                value: "monetization-loot-boxes",
                            },
                            {
                                title: "💳 Monetization: Cosmetic Loot boxes",
                                value: "monetization-cosmetic-loot-boxes",
                            },
                            { title: "💳 Monetization: Pay to win", value: "monetization-p2w" },
                            {
                                title: "💳 Monetization: Character slots",
                                value: "monetization-character-slots",
                            },
                            {
                                title: "💳 Monetization: Pay for convenience",
                                value: "monetization-pay-for-convenience",
                                description: "Stash tabs / Character slots / Action house slots",
                            },
                        ],
                    },
                },
            ],
            options: {
                layout: "list",
            },
            group: "main",
        },
        {
            name: "seasonKeyword",
            title: "Season keyword",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
            group: "main",
        },

        {
            name: "official",
            title: "Official",
            description: "Is this an official game/ladder?",
            type: "boolean",
            initialValue: true,
            validation: (Rule: Rule) => Rule.required(),
            group: "toggles",
        },
        {
            name: "isComingSoon",
            title: "Coming Soon",
            description: "Is this game prior to release?",
            type: "boolean",
            initialValue: false,
            group: "toggles",
        },
        {
            name: "isDormant",
            title: "Dormant",
            description: "Has this game stopped getting regular content updates?",
            type: "boolean",
            initialValue: false,
            group: "toggles",
        },
        {
            name: "isSeasonal",
            title: "Seasonal",
            description: "Does this game have regular seasons?",
            type: "boolean",
            initialValue: true,
            group: "toggles",
        },

        {
            name: "group",
            title: "Group",
            type: "string",
            group: "main",
        },
        {
            name: "logo",
            title: "Logo",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: (Rule: Rule) => Rule.required(),
            group: "main",
        },
        {
            name: "url",
            title: "URL",
            type: "url",
            group: "main",
        },
        {
            name: "crawlerSettings",
            title: "Crawler settings",
            type: "object",
            fields: [
                {
                    name: "keywords",
                    title: "Keywords",
                    type: "array",
                    of: [{ type: "string" }],
                },
            ],
            group: "platforms",
        },
        defineField({
            name: "youtube",
            title: "YouTube",
            group: "platforms",
            type: "object",
            fields: [
                defineField({
                    name: "channel",
                    title: "Official channel",
                    type: "string",
                }),
            ],
        }),
        defineField({
            name: "twitch",
            title: "Twitch",
            group: "platforms",
            type: "object",
            fields: [
                defineField({
                    name: "category",
                    title: "Category slug",
                    description:
                        "Name of category where all streams related to this game are aggregated",
                    type: "string",
                }),
                defineField({
                    name: "channel",
                    title: "Official channel",
                    type: "string",
                }),
            ],
        }),
        defineField({
            name: "steam",
            title: "Steam",
            group: "platforms",
            type: "object",
            fields: [
                defineField({
                    name: "appId",
                    title: "Steam App ID",
                    type: "number",
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: "name",
            media: "logo",
        },
    },
});
