"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

import { DiscordMemberCard } from "./DiscordMemberCard";

const STATUS_INTERVAL_MS = 3500;

const FlareCard = ({
    statuses,
    index,
    className,
}: {
    statuses: string[];
    index: number;
    className?: string;
}) => (
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
                                    "col-start-1 row-start-1 transition-all duration-500 motion-reduce:translate-y-0 motion-reduce:transition-none",
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

export const DiscordBotHeroCard = ({
    statuses,
    inviteUrl,
    className,
}: {
    statuses: string[];
    inviteUrl?: string;
    className?: string;
}) => {
    const [index, setIndex] = useState(0);
    const [docked, setDocked] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        if (reducedMotion) return;
        const id = setInterval(
            () => setIndex((i) => (i + 1) % statuses.length),
            STATUS_INTERVAL_MS,
        );
        return () => clearInterval(id);
    }, [statuses.length, reducedMotion]);

    useEffect(() => {
        const anchor = anchorRef.current;
        if (!anchor) return;
        const observer = new IntersectionObserver(([entry]) =>
            setDocked(!entry.isIntersecting && entry.boundingClientRect.top < 0),
        );
        observer.observe(anchor);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div ref={anchorRef}>
                <FlareCard statuses={statuses} index={index} className={className} />
            </div>
            <Link
                href={inviteUrl ?? "#"}
                target={inviteUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label="Add the aRPG Timeline bot to Discord"
                aria-hidden={!docked}
                tabIndex={docked ? 0 : -1}
                data-sa-click="discord-bot-docked-card"
                onClick={(e) => {
                    if (inviteUrl) return;
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
                }}
                className={cn(
                    "fixed right-6 bottom-6 z-40 hidden transition-all duration-500 motion-reduce:transition-none lg:block",
                    docked
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-6 opacity-0",
                )}
            >
                <FlareCard statuses={statuses} index={index} />
            </Link>
        </>
    );
};
