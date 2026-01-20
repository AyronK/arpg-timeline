import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface CtaBannerProps {
    icon: ReactNode;
    title: string;
    description: string;
    actionLabel: string;
    color: "orange" | "emerald";
    className?: string;
}

const colorClasses = {
    orange: "bg-orange-500/30 group-hover:bg-orange-500/50",
    emerald: "bg-emerald-500/30 group-hover:bg-emerald-500/50",
};

export const CtaBannerContent = ({
    icon,
    title,
    description,
    actionLabel,
    color,
}: Omit<CtaBannerProps, "className">) => (
    <>
        <div className="flex flex-1 items-center gap-3">
            <div className="bg-muted/50 grid h-10 w-10 shrink-0 place-content-center rounded-full md:h-12 md:w-12">
                {icon}
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
                <h3 className="font-heading text-foreground text-sm font-medium md:text-base">
                    {title}
                </h3>
                <p className="text-muted-foreground text-xs leading-tight md:text-sm">
                    {description}
                </p>
            </div>
        </div>
        <div
            className={cn(
                "border-border text-secondary-foreground flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 transition-colors md:px-4 md:py-2",
                colorClasses[color],
            )}
        >
            <span className="font-heading sr-only text-xs leading-none font-medium md:not-sr-only md:text-sm">
                {actionLabel}
            </span>
            <svg
                className="h-3 w-3 md:h-3.5 md:w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
            </svg>
        </div>
    </>
);

const borderClasses = {
    orange: "border-orange-500/30 hover:border-orange-500/50",
    emerald: "border-emerald-500/30 hover:border-emerald-500/50",
};

export const getCtaBannerClassName = (color: "orange" | "emerald") =>
    cn(
        "text-card-foreground bg-card group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg border-2 p-4 transition-all hover:shadow-md md:p-6",
        borderClasses[color],
    );
