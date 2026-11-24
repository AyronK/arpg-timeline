import Link from "next/link";
import { MouseEvent } from "react";

import { HighlightRange } from "@/lib/search/match";
import { cn } from "@/lib/utils";

const HighlightedText = ({ text, range }: { text: string; range: HighlightRange | null }) =>
    range ? (
        <>
            {text.slice(0, range[0])}
            <mark className="text-primary decoration-primary bg-transparent underline underline-offset-4">
                {text.slice(range[0], range[1])}
            </mark>
            {text.slice(range[1])}
        </>
    ) : (
        text
    );

interface GameResultRowProps {
    id: string;
    href: string;
    name: string;
    highlight: HighlightRange | null;
    isActive: boolean;
    onHover: () => void;
    onNavigate: () => void;
}

export const GameResultRow = ({
    id,
    href,
    name,
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
                "flex min-h-11 items-center rounded-lg px-3 py-2 text-sm",
                isActive && "bg-accent text-accent-foreground",
            )}
        >
            <span className="truncate">
                <HighlightedText text={name} range={highlight} />
            </span>
        </Link>
    );
};
