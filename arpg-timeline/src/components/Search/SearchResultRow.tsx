import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";

import { HighlightRange } from "@/lib/search/match";
import { LOGO_RENDER_SIZE } from "@/lib/search/searchIndexCodec";
import { cn } from "@/lib/utils";

const HighlightedText = ({ text, range }: { text: string; range: HighlightRange | null }) =>
    range ? (
        <>
            {text.slice(0, range[0])}
            <mark className="text-primary bg-transparent font-semibold">
                {text.slice(range[0], range[1])}
            </mark>
            {text.slice(range[1])}
        </>
    ) : (
        text
    );

const initials = (name: string) =>
    name
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

interface GameResultRowProps {
    id: string;
    href: string;
    name: string;
    meta: string;
    logoSrc: string | null;
    highlight: HighlightRange | null;
    isActive: boolean;
    onHover: () => void;
    onNavigate: () => void;
}

export const GameResultRow = ({
    id,
    href,
    name,
    meta,
    logoSrc,
    highlight,
    isActive,
    onHover,
    onNavigate,
}: GameResultRowProps) => {
    const onClick = (e: MouseEvent) => {
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
            onNavigate();
        }
    };

    return (
        <Link
            id={id}
            href={href}
            prefetch={false}
            role="option"
            aria-selected={isActive}
            tabIndex={-1}
            onMouseMove={onHover}
            onClick={onClick}
            className={cn(
                "bg-background/40 flex items-center gap-3 rounded-md border border-transparent p-2 transition-colors",
                isActive && "border-foreground/30 bg-accent/40",
            )}
        >
            <div className="bg-muted/50 grid h-10 w-10 shrink-0 place-content-center overflow-hidden rounded-md">
                {logoSrc ? (
                    <Image
                        unoptimized
                        src={logoSrc}
                        alt=""
                        width={LOGO_RENDER_SIZE}
                        height={LOGO_RENDER_SIZE}
                        className="h-8 w-8 object-contain"
                    />
                ) : (
                    <span className="font-heading text-muted-foreground text-xs">
                        {initials(name)}
                    </span>
                )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-heading text-foreground truncate text-sm">
                    <HighlightedText text={name} range={highlight} />
                </span>
                {meta && <span className="text-muted-foreground truncate text-xs">{meta}</span>}
            </div>
            <ChevronRight
                className={cn(
                    "text-muted-foreground h-4 w-4 shrink-0 transition-opacity",
                    !isActive && "opacity-0",
                )}
            />
        </Link>
    );
};
