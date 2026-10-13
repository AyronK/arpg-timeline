"use client";

import { useHasMounted } from "@react-hooks-library/core";
import Image from "next/image";
import Link from "next/link";
import { Fragment, ReactNode } from "react";

import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { useOpenFiltersFromHiddenMarker } from "@/hooks/useOpenFiltersFromHiddenMarker";
import { getHiddenByFiltersLabel } from "@/lib/filters/filterState";

import { DashboardConfig } from "./DashboardConfig";

const linkClassName =
    "text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center underline-offset-2 hover:underline";

export const CantFindGame = () => {
    const { hiddenGamesSummary: summary, category } = useGameFilterContext();
    const openFilters = useOpenFiltersFromHiddenMarker();
    // Stored filters are only known in the browser
    const hiddenGamesSummary = useHasMounted() ? summary : null;
    const hasHidden = !!hiddenGamesSummary && hiddenGamesSummary.hiddenCount > 0;
    const hiddenLabel = hiddenGamesSummary ? getHiddenByFiltersLabel(hiddenGamesSummary) : "";

    const links: { key: string; node: ReactNode }[] = [];
    if (category !== "all") {
        links.push({
            key: "catalog",
            node: (
                <Link
                    href="/dashboard/all"
                    className={linkClassName}
                    data-sa-click="cant-find-catalog"
                >
                    {DashboardConfig.all?.description}
                </Link>
            ),
        });
    }
    links.push({
        key: "discord",
        node: (
            <Link
                href={process.env.NEXT_PUBLIC_DISCORD_URL}
                rel="noopener noreferrer nofollow"
                target="_blank"
                data-sa-click="click"
                className={linkClassName}
            >
                <Image
                    loading="lazy"
                    unoptimized
                    src="/assets/third-party/discord-logo.svg"
                    className="mr-1.5 h-4 w-4 brightness-200 grayscale-100"
                    alt="Discord logo"
                    width={20}
                    height={20}
                />
                Request on Discord
            </Link>
        ),
    });

    return (
        <div className="bg-card 3xl:nth-[2]:order-first 3xl:nth-[3]:order-first 3xl:nth-[4]:order-first 4xl:nth-[2]:order-first 4xl:nth-[3]:order-first 4xl:nth-[4]:order-first 4xl:nth-[5]:order-first order-last flex flex-col items-center justify-center gap-3 rounded-md p-6 text-center lg:nth-[2]:order-first xl:nth-[2]:order-first">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Can&apos;t find a game?
            </h3>
            {hasHidden && (
                <button
                    type="button"
                    className="text-foreground/80 hover:text-foreground decoration-muted-foreground hover:decoration-foreground cursor-pointer text-sm font-semibold underline underline-offset-2 transition-colors"
                    onClick={() =>
                        openFilters({ entry: "cant-find", count: hiddenGamesSummary.hiddenCount })
                    }
                >
                    {hiddenLabel}
                </button>
            )}
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
                {links.map(({ key, node }, idx) => (
                    <Fragment key={key}>
                        {idx > 0 && <span aria-hidden="true">·</span>}
                        {node}
                    </Fragment>
                ))}
            </p>
        </div>
    );
};
