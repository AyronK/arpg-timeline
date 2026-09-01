import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const BuyMeACoffeeCompact = ({ className }: { className?: string }) => {
    if (!process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL) return null;

    return (
        <Link
            href={process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL}
            rel="noopener noreferrer nofollow"
            target="_blank"
            data-sa-click="bmc-banner-compact"
            className={cn(
                "group bg-card flex items-center gap-3 rounded-lg border border-amber-500/30 p-3 transition-all hover:border-amber-500/50 hover:shadow-sm",
                className,
            )}
        >
            <Image
                loading="lazy"
                src="/assets/third-party/bmc-logo.svg"
                className="size-5 shrink-0 opacity-70"
                alt="Buy Me a Coffee logo"
                width={24}
                height={24}
            />
            <span className="min-w-0 flex-1 text-xs leading-tight">
                <span className="text-foreground block font-medium">Buy me a coffee</span>
                <span className="text-muted-foreground">One-off tip, no sign-up</span>
            </span>
            <ChevronRight
                className="text-muted-foreground group-hover:text-foreground size-3.5 shrink-0 transition-colors"
                aria-hidden
            />
        </Link>
    );
};
