"use client";

import { ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

import type { TocHeading } from "@/lib/articles/tableOfContents";
import { useActiveHeading } from "@/lib/articles/useActiveHeading";
import { cn } from "@/lib/utils";

type Variant = "sidebar" | "bottom";

interface Props {
    headings: TocHeading[];
    variant: Variant;
}

export const ArticleToc = ({ headings, variant }: Props) => {
    const ids = useMemo(() => headings.map((h) => h.id), [headings]);
    const active = useActiveHeading(ids);
    const [open, setOpen] = useState(false);

    if (headings.length < 2) return null;

    const activeHeading = headings.find((h) => h.id === active) ?? headings[0];

    const link = (h: TocHeading, onClick?: () => void) => (
        <a
            href={`#${h.id}`}
            onClick={onClick}
            aria-current={h.id === active ? "location" : undefined}
            className={cn(
                "hover:text-foreground block py-1 underline-offset-2 hover:underline",
                h.level === 3 && "pl-3",
                h.id === active ? "text-foreground font-medium" : "text-muted-foreground",
            )}
        >
            {h.text}
        </a>
    );

    if (variant === "sidebar") {
        return (
            <nav aria-label="Table of contents" className="border-border/60 border-l pl-4 text-sm">
                <p className="font-heading mb-2 text-xs font-semibold tracking-wide uppercase">
                    On this page
                </p>
                <ul>
                    {headings.map((h) => (
                        <li
                            key={h.id}
                            className={cn(
                                "-ml-4 border-l-2 pl-4",
                                h.id === active ? "border-primary" : "border-transparent",
                            )}
                        >
                            {link(h)}
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }

    return (
        <div className="bg-background/95 border-border/60 fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur lg:hidden">
            <div
                className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
            >
                <div className="overflow-hidden">
                    <nav
                        aria-label="Table of contents"
                        aria-hidden={!open}
                        inert={!open}
                        className="border-border/60 max-h-[55vh] overflow-y-auto border-b px-4 pt-3 pb-2 text-sm"
                    >
                        <ul>
                            {headings.map((h) => (
                                <li key={h.id}>{link(h, () => setOpen(false))}</li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm"
            >
                <span className="min-w-0 truncate">
                    <span className="text-muted-foreground">On this page: </span>
                    {activeHeading.text}
                </span>
                <ChevronUp
                    className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
                    aria-hidden
                />
            </button>
        </div>
    );
};
