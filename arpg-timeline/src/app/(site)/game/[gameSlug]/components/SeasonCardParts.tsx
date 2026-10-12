import { ExternalLinkIcon } from "lucide-react";
import { ReactNode } from "react";

import { GuardedExternalLink } from "@/components/GuardedExternalLink";
import { cn } from "@/lib/utils";

// Shared by the Overview Now/Next cards and the Timeline cards so both read the same way

export const SeasonBadgeRow = ({ chips, action }: { chips: ReactNode; action?: ReactNode }) => (
    <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">{chips}</div>
        {action}
    </div>
);

export const PatchNotesLink = ({
    href,
    isOfficial,
    saClick,
}: {
    href: string;
    isOfficial: boolean;
    saClick: string;
}) => (
    <GuardedExternalLink
        href={href}
        isOfficial={isOfficial}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground text-sm whitespace-nowrap hover:underline"
        data-sa-click={saClick}
    >
        Patch notes
    </GuardedExternalLink>
);

export const SeasonTitle = ({
    as: Tag = "p",
    title,
    href,
    isOfficial,
    className,
    saClick,
    onClick,
}: {
    as?: "p" | "h3";
    title: string;
    href?: string | null;
    isOfficial: boolean;
    className?: string;
    saClick?: string;
    onClick?: () => void;
}) => (
    <Tag className={cn("font-heading leading-tight", className)}>
        {href ? (
            <GuardedExternalLink
                href={href}
                isOfficial={isOfficial}
                noIcon
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit underline decoration-transparent underline-offset-4 hover:decoration-current/75"
                data-sa-click={saClick}
                onClick={onClick}
            >
                {/* One inline span so the icon follows the last word when the title wraps */}
                <span>
                    {title}
                    <ExternalLinkIcon
                        className="ml-1 inline-block h-3.5 w-3.5 align-baseline opacity-70"
                        aria-hidden
                    />
                </span>
            </GuardedExternalLink>
        ) : (
            title
        )}
    </Tag>
);
