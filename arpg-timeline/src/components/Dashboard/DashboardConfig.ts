import { ArrowRightToLine, FlaskConical, Library, Newspaper, Users } from "lucide-react";

import { GameFilterCategory } from "@/lib/cms/gameTags";

import { LogoIcon } from "../LogoIcon";

export type DashboardOption = GameFilterCategory | "news";

export const DashboardConfig: Partial<
    Record<
        DashboardOption,
        {
            description: string;
            tooltip: string;
            // One-line subtitle in the mobile selector; falls back to tooltip
            shortTooltip?: string;
            icon: React.ComponentType<{ className?: string }>;
        }
    >
> = {
    featured: {
        description: "Featured",
        tooltip:
            "A curated set: hides community projects and games with no recent updates or confirmed season. Change it in Filters.",
        shortTooltip: "Curated set of actively updated games",
        icon: LogoIcon,
    },
    "early-access": {
        description: "Early Access",
        tooltip: "Games currently in early access or open beta",
        icon: FlaskConical,
    },
    "non-seasonal": {
        description: "Non-Seasonal",
        tooltip: "Games that do not feature seasonal updates",
        icon: ArrowRightToLine,
    },
    community: {
        description: "Community",
        tooltip: "Community-driven mods, events, and fan projects",
        icon: Users,
    },
    all: {
        description: "Full Catalog",
        tooltip: "Display all games together in one comprehensive view",
        icon: Library,
    },
    news: {
        description: "Latest News",
        tooltip: "Read the latest news and updates",
        icon: Newspaper,
    },
};
