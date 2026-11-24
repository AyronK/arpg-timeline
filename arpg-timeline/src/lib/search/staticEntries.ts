import {
    Award,
    Bot,
    CalendarPlus,
    CircleHelp,
    Code,
    Eye,
    FileText,
    Heart,
    Library,
    LucideIcon,
    MessagesSquare,
    Newspaper,
    Rocket,
    ScrollText,
    ShieldCheck,
    SlidersHorizontal,
} from "lucide-react";

export interface StaticEntry {
    id: string;
    kind: "page" | "action";
    title: string;
    shortTitle?: string;
    description: string;
    href: string;
    external?: boolean;
    keywords: string[];
    icon: LucideIcon;
    iconSrc?: string;
    command?: "open-filters";
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
        shortTitle: "Calendar",
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
        keywords: ["patreon", "donate"],
        icon: Heart,
    },
    {
        id: "supporters",
        kind: "page",
        title: "Credits & supporters",
        description: "People who help keep aRPG Timeline running",
        href: "/support#supporters",
        keywords: ["credits", "supporters", "patrons", "thanks"],
        icon: Award,
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
        id: "community-launchers",
        kind: "page",
        title: "Community launchers",
        description: "About community-run servers and launchers",
        href: "/community-launchers",
        keywords: ["launcher", "private server", "unofficial", "mods"],
        icon: Rocket,
    },
    {
        id: "privacy",
        kind: "page",
        title: "Privacy & GDPR",
        description: "What data is collected and how it is used",
        href: "/privacy",
        keywords: ["privacy policy", "gdpr", "cookies", "legal"],
        icon: ShieldCheck,
    },
    {
        id: "terms",
        kind: "page",
        title: "Terms of Service",
        description: "Terms for the site, API, widgets and Discord bot",
        href: "/terms",
        keywords: ["tos", "toc", "terms and conditions", "legal"],
        icon: FileText,
    },
    {
        id: "transparency",
        kind: "page",
        title: "Transparency",
        description: "Source code, license and what you can do with it",
        href: "/transparency",
        keywords: ["source code", "open source", "license", "github"],
        icon: Eye,
    },
    {
        id: "full-catalog",
        kind: "action",
        title: "Go to Full Catalog",
        shortTitle: "Full Catalog",
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
    {
        id: "open-filters",
        kind: "action",
        title: "Open game filters",
        shortTitle: "Filters",
        description: "Choose which games this dashboard shows",
        href: "",
        command: "open-filters",
        keywords: ["filters", "hide games", "show games", "hidden"],
        icon: SlidersHorizontal,
    },
    {
        id: "join-discord",
        kind: "action",
        title: "Join Discord",
        description: "Chat with the community and request games",
        href: process.env.NEXT_PUBLIC_DISCORD_URL ?? "",
        external: true,
        keywords: ["discord", "community", "chat", "contact"],
        icon: MessagesSquare,
        iconSrc: "/assets/third-party/discord-logo.svg",
    },
];

export const QUICK_LINK_IDS = ["full-catalog", "calendar", "faq", "discord-bot", "open-filters"];

export const MOBILE_CHIP_IDS = ["full-catalog", "calendar", "faq", "open-filters"];

export const isEntryAvailable = (entry: StaticEntry, canOpenFilters: boolean) =>
    canOpenFilters || !entry.command;
