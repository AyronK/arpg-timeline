import {
    Bot,
    CalendarPlus,
    CircleHelp,
    Code,
    Heart,
    Library,
    LucideIcon,
    Newspaper,
    ScrollText,
} from "lucide-react";

export interface StaticEntry {
    id: string;
    kind: "page" | "action";
    title: string;
    description: string;
    href: string;
    keywords: string[];
    icon: LucideIcon;
}

export const STATIC_ENTRIES: StaticEntry[] = [
    {
        id: "faq",
        kind: "page",
        title: "FAQ",
        description: "Answers to common questions",
        href: "/faq",
        keywords: ["help", "questions"],
        icon: CircleHelp,
    },
    {
        id: "calendar",
        kind: "page",
        title: "Calendar subscribe",
        description: "Add season dates to your calendar",
        href: "/calendar",
        keywords: ["ics", "google calendar", "outlook", "ical"],
        icon: CalendarPlus,
    },
    {
        id: "discord-bot",
        kind: "page",
        title: "Discord bot",
        description: "Season announcements in your Discord server",
        href: "/discord-bot",
        keywords: ["bot", "server", "announcements"],
        icon: Bot,
    },
    {
        id: "support",
        kind: "page",
        title: "Support",
        description: "Ways to support aRPG Timeline",
        href: "/support",
        keywords: ["patreon", "donate", "supporters"],
        icon: Heart,
    },
    {
        id: "api-docs",
        kind: "page",
        title: "API docs",
        description: "Public API for game and season data",
        href: "/docs/api",
        keywords: ["api", "developers", "openapi"],
        icon: Code,
    },
    {
        id: "news",
        kind: "page",
        title: "News",
        description: "Articles from aRPG Timeline",
        href: "/news",
        keywords: ["articles", "guides"],
        icon: ScrollText,
    },
    {
        id: "full-catalog",
        kind: "action",
        title: "Go to Full Catalog",
        description: "All games in one view",
        href: "/dashboard/all",
        keywords: ["all games", "catalog"],
        icon: Library,
    },
    {
        id: "latest-news",
        kind: "action",
        title: "Latest news",
        description: "Recent news from all games",
        href: "/games/news",
        keywords: ["news", "patch notes", "updates"],
        icon: Newspaper,
    },
];

export const QUICK_LINK_IDS = ["full-catalog", "calendar", "faq", "discord-bot"];
