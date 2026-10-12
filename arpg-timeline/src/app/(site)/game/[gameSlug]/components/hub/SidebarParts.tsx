import { ExternalLink } from "lucide-react";
import { ReactNode } from "react";

import { BuyMeACoffeeCompact } from "@/components/articles/BuyMeACoffeeCompact";
import { PatreonFundingCompact } from "@/components/articles/PatreonFundingCompact";
import { MONTHLY_VISITORS, SITE_MONTHLY_COST } from "@/components/PatreonFunding";
import { cn } from "@/lib/utils";

import { cardClassName } from "../overview/OverviewCard";

// Sidebar pieces shared by every hub tab
export const linkClassName =
    "hover:bg-accent -mx-2 flex items-center !gap-3 rounded-md px-2 py-2 text-sm transition-colors";

export const LinkRow = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
    <>
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <span className="flex-1">{children}</span>
        <ExternalLink className="text-muted-foreground h-3.5 w-3.5 shrink-0" aria-hidden />
    </>
);

// Same compact Patreon / Buy Me a Coffee rows as the article sidebar
export const SupportCard = ({ className }: { className?: string }) => {
    if (!process.env.NEXT_PUBLIC_PATREON_URL && !process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL) {
        return null;
    }

    return (
        <section className={cn(cardClassName, "flex flex-col gap-4", className)}>
            <div>
                <h2 className="font-heading text-lg">Keep aRPG Timeline free</h2>
                <p className="text-muted-foreground mt-2 text-sm">
                    Hosting costs ${SITE_MONTHLY_COST}/month. Your support keeps it running for{" "}
                    {MONTHLY_VISITORS}+ players.
                </p>
            </div>
            <div className="mt-auto flex flex-col gap-2">
                <PatreonFundingCompact />
                <BuyMeACoffeeCompact />
            </div>
        </section>
    );
};

export const hostname = (url: string) => {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
};

export const ExternalRow = ({
    href,
    saClick,
    icon,
    children,
}: {
    href: string;
    saClick: string;
    icon: ReactNode;
    children: ReactNode;
}) => (
    <li>
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            data-sa-click={saClick}
            className={linkClassName}
        >
            <LinkRow icon={icon}>{children}</LinkRow>
        </a>
    </li>
);
