"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { DiscordMemberCard } from "./DiscordMemberCard";

const STATUS_INTERVAL_MS = 3500;

export const DiscordBotHeroCard = ({
    statuses,
    className,
}: {
    statuses: string[];
    className?: string;
}) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const id = setInterval(
            () => setIndex((i) => (i + 1) % statuses.length),
            STATUS_INTERVAL_MS,
        );
        return () => clearInterval(id);
    }, [statuses.length]);

    return (
        <div
            className={cn(
                "relative isolate overflow-hidden rounded-[10px] p-px shadow-[0_0_48px_-16px_#5865f2]",
                className,
            )}
        >
            <div
                aria-hidden
                className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#5865f2_320deg,#c9cdfb_350deg,transparent_360deg)] motion-reduce:animate-none motion-reduce:bg-white/10"
            />
            <div className="bg-background rounded-[9px]">
                <DiscordMemberCard
                    name="aRPG Timeline"
                    className="hover:bg-transparent"
                    status={
                        <span className="grid">
                            {statuses.map((status, i) => (
                                <span
                                    key={status}
                                    aria-hidden={i !== index}
                                    className={cn(
                                        "col-start-1 row-start-1 transition-all duration-500",
                                        i === index
                                            ? "translate-y-0 opacity-100"
                                            : "translate-y-1 opacity-0",
                                    )}
                                >
                                    {status}
                                </span>
                            ))}
                        </span>
                    }
                />
            </div>
        </div>
    );
};
