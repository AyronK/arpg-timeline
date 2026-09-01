import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { FaPatreon } from "react-icons/fa6";

import { cn } from "@/lib/utils";

export const PatreonFundingCompact = ({ className }: { className?: string }) => {
    if (!process.env.NEXT_PUBLIC_PATREON_URL) return null;

    return (
        <Link
            href={process.env.NEXT_PUBLIC_PATREON_URL}
            rel="noopener noreferrer nofollow"
            target="_blank"
            data-sa-click="patreon-banner-compact"
            className={cn(
                "group bg-card border-foreground/20 hover:border-foreground/40 flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-sm",
                className,
            )}
        >
            <FaPatreon className="size-4 shrink-0 text-white" aria-label="Patreon logo" />
            <span className="min-w-0 flex-1 text-xs leading-tight">
                <span className="text-foreground block font-medium">Keep the site running</span>
                <span className="text-muted-foreground">Support on Patreon</span>
            </span>
            <ChevronRight
                className="text-muted-foreground group-hover:text-foreground size-3.5 shrink-0 transition-colors"
                aria-hidden
            />
        </Link>
    );
};
