import { ArrowRightToLine, FlaskConical, Library, Users } from "lucide-react";

import { GameFilterCategory } from "@/lib/cms/gameTags";

import { LogoIcon } from "../LogoIcon";

export const DashboardConfig: Partial<
    Record<
        GameFilterCategory,
        { description: string; tooltip: string; icon: React.ComponentType<{ className?: string }> }
    >
> = {
    featured: {
        description: "Featured",
        tooltip: "Seasonal games and games with upcoming updates",
        icon: LogoIcon,
    },
    "non-seasonal": {
        description: "Non-Seasonal",
        tooltip: "Games that do not feature seasonal updates or follow a classic DLC model",
        icon: ArrowRightToLine,
    },
    "early-access": {
        description: "Early Access",
        tooltip: "Games currently in early access or open beta",
        icon: FlaskConical,
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
};
