"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { Breadcrumbs } from "@/components/articles/Breadcrumbs";
import type { Crumb } from "@/lib/articles/breadcrumbs";
import { cn } from "@/lib/utils";

import { getActiveHubTab, HubTab } from "../../hub";

const useActiveTab = () => getActiveHubTab(useSelectedLayoutSegment());

export const HubBreadcrumbs = ({ gameName, tabs }: { gameName: string; tabs: HubTab[] }) => {
    const active = useActiveTab();
    const overview = tabs[0];
    const crumbs: Crumb[] = [
        { name: "Home", href: "/" },
        { name: gameName, href: overview.href },
    ];
    const tab = tabs.find((t) => t.id === active);
    if (tab && tab.id !== "overview") crumbs.push({ name: tab.label, href: tab.href });

    return <Breadcrumbs crumbs={crumbs} />;
};

// Overview owns the game-name h1; sub-pages render their own h1.
export const HubTitle = ({ name }: { name: string }) => {
    const className = "font-heading text-2xl leading-tight md:text-3xl";
    return useActiveTab() === "overview" ? (
        <h1 className={className}>{name}</h1>
    ) : (
        <p className={className}>{name}</p>
    );
};

export const HubTabs = ({ tabs, gameSlug }: { tabs: HubTab[]; gameSlug: string }) => {
    const active = useActiveTab();

    return (
        <nav aria-label="Game sections" className="border-foreground/10 mt-4 border-b">
            <ul className="-mb-px flex overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = tab.id === active;
                    return (
                        <li key={tab.id} className="shrink-0">
                            <Link
                                href={tab.href}
                                aria-current={isActive ? "page" : undefined}
                                data-sa-click={`${gameSlug}-hub-tab-${tab.id}`}
                                className={cn(
                                    "font-ui flex min-h-11 items-center border-b-2 px-4 text-sm transition-colors",
                                    isActive
                                        ? "border-foreground text-foreground font-semibold"
                                        : "text-muted-foreground hover:text-foreground border-transparent font-medium",
                                )}
                            >
                                {tab.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
