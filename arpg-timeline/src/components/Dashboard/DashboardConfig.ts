import { FlaskConical, RotateCwSquare,Telescope, Users } from "lucide-react";

import { DashboardTag } from "@/lib/cms/gameTags";

import { LogoIcon } from "../LogoIcon";

export const DashboardConfig: Partial<
    Record<
        DashboardTag,
        { description: string; tooltip: string; icon: React.ComponentType<{ className?: string }> }
    >
> = {
    "default-when-next-confirmed": {
        description: "Standard",
        tooltip: "Top picks and recommendations from aRPG Timeline",
        icon: LogoIcon,
    },
    seasonal: {
        description: "Seasonal",
        tooltip: "Games with active or upcoming seasons and ladders",
        icon: RotateCwSquare,
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
    other: {
        description: "Explore",
        tooltip:
            "Other games related to the genre or with similar appeal that do not strictly follow a seasonal aRPG type",
        icon: Telescope,
    },
};
