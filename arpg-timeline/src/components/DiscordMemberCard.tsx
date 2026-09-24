import { Check } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Logo } from "./Logo";

interface DiscordMemberCardProps {
    name: string;
    status: ReactNode;
    size?: "sm" | "md";
    className?: string;
}

export const DiscordMemberCard = ({
    name,
    status,
    size = "md",
    className,
}: DiscordMemberCardProps) => (
    <div
        className={cn(
            "inline-flex items-center rounded-lg text-left transition-colors hover:bg-[#35373c]",
            size === "md" && "gap-3 py-2 pr-5 pl-2.5",
            size === "sm" && "gap-2.5 py-1.5 pr-4 pl-2",
            className,
        )}
    >
        <div className="relative shrink-0">
            <div
                className={cn(
                    "bg-background text-foreground grid place-content-center rounded-full",
                    size === "md" && "h-10 w-10 md:h-12 md:w-12",
                    size === "sm" && "h-8 w-8",
                )}
            >
                <Logo className={cn(size === "md" ? "h-8 w-8 md:h-10 md:w-10" : "h-6 w-6")} />
            </div>
            <span
                aria-label="Online"
                className={cn(
                    "absolute -right-0.5 -bottom-0.5 rounded-full border-[#2b2d31] bg-[#23a55a]",
                    size === "md" && "h-3.5 w-3.5 border-[3px] md:h-4 md:w-4",
                    size === "sm" && "h-3 w-3 border-2",
                )}
            />
        </div>
        <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-1.5">
                <span
                    className={cn(
                        "truncate font-medium text-[#f2f3f5]",
                        size === "md" ? "text-sm md:text-base" : "text-sm",
                    )}
                >
                    {name}
                </span>
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-[3px] bg-[#5865f2] px-1 py-px text-[10px] leading-3 font-semibold text-white uppercase">
                    <Check className="h-2.5 w-2.5" strokeWidth={4} aria-hidden />
                    App
                </span>
            </div>
            <span className="truncate text-xs text-[#b5bac1]">{status}</span>
        </div>
    </div>
);
