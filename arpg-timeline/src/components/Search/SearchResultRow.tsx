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

export const IconTile = ({ icon: Icon, iconSrc }: { icon: LucideIcon; iconSrc?: string }) => (
    <Tile>
        {iconSrc ? (
            <Image
                unoptimized
                src={iconSrc}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 opacity-70 brightness-200 grayscale-100"
            />
        ) : (
            <Icon className="text-muted-foreground h-4 w-4" />
        )}
    </Tile>
);

export interface RowAction {
    label: string;
    description: string;
    hint: string;
    icon: LucideIcon;
    run: (input: "keyboard" | "pointer") => void;
}

interface SearchResultRowProps {
    id: string;
    href: string | null;
    title: string;
    meta: string;
    tile: ReactNode;
    action?: RowAction | null;
    highlight: HighlightRange | null;
    isActive: boolean;
    replace: boolean;
    external?: boolean;
    onHover: () => void;
    onNavigate: () => void;
    onActivate?: () => void;
}

export const SearchResultRow = ({
    id,
    href,
    title,
    meta,
    tile,
    action,
    highlight,
    isActive,
    replace,
    external,
    onHover,
    onNavigate,
    onActivate,
}: SearchResultRowProps) => {
    const onClick = (e: MouseEvent) => {
        onActivate?.();
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
            onNavigate();
        }
    };

    const optionProps = {
        id,
        role: "option",
        "aria-selected": isActive,
        tabIndex: -1,
        onClick,
        className: "flex min-w-0 flex-1 cursor-pointer items-center gap-3 p-2",
    };

    const content = (
        <>
            {tile}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-heading text-foreground truncate text-sm">
                    <HighlightedText text={title} range={highlight} />
                </span>
                {meta && <span className="text-muted-foreground truncate text-xs">{meta}</span>}
            </div>
            {!action && (
                <ChevronRight
                    className={cn(
                        "text-muted-foreground h-4 w-4 shrink-0 transition-opacity",
                        !isActive && "opacity-0",
                    )}
                />
            )}
        </>
    );

    return (
        <div
            role="presentation"
            onMouseMove={onHover}
            className={cn(
                "bg-background/40 flex items-center rounded-md border border-transparent transition-colors",
                isActive && "border-foreground/30 bg-accent/40",
            )}
        >
            {href ? (
                <Link
                    {...optionProps}
                    href={href}
                    replace={!external && replace}
                    prefetch={false}
                    {...(external && { target: "_blank", rel: "noopener noreferrer nofollow" })}
                >
                    {content}
                </Link>
            ) : (
                <div {...optionProps}>{content}</div>
            )}
            {action && (
                <button
                    type="button"
                    tabIndex={-1}
                    title={action.description}
                    onClick={() => action.run("pointer")}
                    className="border-foreground/20 text-muted-foreground hover:text-foreground hover:border-foreground/40 mr-2 inline-flex shrink-0 cursor-pointer items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap transition-colors"
                >
                    <action.icon aria-hidden className="h-3 w-3" />
                    <span aria-hidden>{action.label}</span>
                    <span className="sr-only">{action.description}</span>
                </button>
            )}
        </div>
    );
};
