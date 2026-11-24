import { ChevronRight, LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, ReactNode } from "react";

import { HighlightRange } from "@/lib/search/match";
import { LOGO_RENDER_HEIGHT, LOGO_RENDER_WIDTH } from "@/lib/search/searchIndexCodec";
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

const Tile = ({ children }: { children: ReactNode }) => (
    <div className="bg-muted/50 flex h-10 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md">
        {children}
    </div>
);

export const GameTile = ({ name, logoSrc }: { name: string; logoSrc: string | null }) => (
    <Tile>
        {logoSrc ? (
            <Image
                unoptimized
                src={logoSrc}
                alt=""
                width={LOGO_RENDER_WIDTH}
                height={LOGO_RENDER_HEIGHT}
                className="h-full w-full object-contain p-1"
            />
        ) : (
            <span className="font-heading text-muted-foreground text-xs">{initials(name)}</span>
        )}
    </Tile>
);

export const IconTile = ({ icon: Icon }: { icon: LucideIcon }) => (
    <Tile>
        <Icon className="text-muted-foreground h-4 w-4" />
    </Tile>
);

interface SearchResultRowProps {
    id: string;
    href: string;
    title: string;
    meta: string;
    tile: ReactNode;
    highlight: HighlightRange | null;
    isActive: boolean;
    onHover: () => void;
    onNavigate: () => void;
}

export const SearchResultRow = ({
    id,
    href,
    title,
    meta,
    tile,
    highlight,
    isActive,
    onHover,
    onNavigate,
}: SearchResultRowProps) => {
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
            {tile}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-heading text-foreground truncate text-sm">
                    <HighlightedText text={title} range={highlight} />
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
