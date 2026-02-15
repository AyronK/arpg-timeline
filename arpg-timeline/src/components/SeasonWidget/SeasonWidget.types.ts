import { PropsWithChildren } from "react";

export type SeasonChip = "over" | "next" | "now" | "live" | "dormant" | "comingSoon";

export type SeasonWidgetProps = React.HTMLAttributes<HTMLDivElement> &
    PropsWithChildren & {
        readonly chip: SeasonChip;
        readonly url?: string | undefined;
        readonly name: string;
        readonly isOfficial?: boolean;
    };
