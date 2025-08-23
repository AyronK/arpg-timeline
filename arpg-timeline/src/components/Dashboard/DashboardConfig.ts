import { FlaskConical, Gamepad2, Telescope, Users } from "lucide-react";

import { DashboardTag } from "@/lib/cms/gameTags";

import { Logo } from "../Logo";

export const DashboardConfig: Partial<
    Record<
        DashboardTag,
        { description: string; tooltip: string; icon: React.ComponentType<{ className?: string }> }
    >
> = {
    "default-when-next-confirmed": {
        description: "Standard",
        tooltip: "Top picks and recommendations from aRPG Timeline",
        icon: Logo,
    },
    seasonal: {
        description: "Seasonal",
        tooltip: "Games with active or upcoming seasons and ladders",
        icon: Gamepad2,
    },
    "early-access": {
        description: "Early Access",
        tooltip: "Games currently in early access, open beta, or preview",
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
