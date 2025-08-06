import { LucideProps } from "lucide-react";
import { ComponentType, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export const IconLabel = ({
    children,
    icon,
    iconPosition,
    iconClassName,
    className,
}: PropsWithChildren & {
    icon: ComponentType<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    iconPosition?: "start" | "end" | undefined;
    className?: string | undefined;
    iconClassName?: string | undefined;
}) => {
    const Icon = icon;
    return (
        <div
            className={cn(
                "flex flex-nowrap items-center gap-1 overflow-hidden text-sm text-nowrap",
                {
                    "flex-row": iconPosition === "start",
                    "flex-row-reverse": iconPosition === "end",
                },
                className,
            )}
        >
            <Icon className={iconClassName} width={"1rem"} height={"1rem"} />
            {children}
        </div>
    );
};
