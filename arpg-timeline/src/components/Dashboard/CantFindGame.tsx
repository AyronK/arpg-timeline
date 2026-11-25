"use client";

import { useHasMounted } from "@react-hooks-library/core";
import Image from "next/image";
import Link from "next/link";
import { Fragment, ReactNode } from "react";

import { SearchTrigger } from "@/components/Search/SearchTrigger";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { useOpenFiltersFromHiddenMarker } from "@/hooks/useOpenFiltersFromHiddenMarker";
import { getHiddenByFiltersLabel } from "@/lib/filters/filterState";

const linkClassName =
    "text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center font-normal underline-offset-2 hover:underline";

export const CantFindGame = () => {
    const { hiddenGamesSummary: summary } = useGameFilterContext();
    const openFilters = useOpenFiltersFromHiddenMarker();
    // Stored filters are only known in the browser
    const hiddenGamesSummary = useHasMounted() ? summary : null;
    const hasHidden = !!hiddenGamesSummary && hiddenGamesSummary.hiddenCount > 0;
    const hiddenLabel = hiddenGamesSummary ? getHiddenByFiltersLabel(hiddenGamesSummary) : "";

    const links: { key: string; node: ReactNode }[] = [];
    if (hasHidden) {
        links.push({
            key: "hidden",
            node: (
                <button
                    type="button"
                    className={linkClassName}
                    onClick={() =>
                        openFilters({ entry: "cant-find", count: hiddenGamesSummary.hiddenCount })
                    }
                >
                    {hiddenLabel}
                </button>
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
        <div className="bg-card 3xl:nth-[2]:order-first 3xl:nth-[3]:order-first 3xl:nth-[4]:order-first 4xl:nth-[2]:order-first 4xl:nth-[3]:order-first 4xl:nth-[4]:order-first 4xl:nth-[5]:order-first order-last flex flex-col items-center justify-center gap-8 rounded-md p-6 text-center lg:nth-[2]:order-first xl:nth-[2]:order-first">
            <div className="flex w-full flex-col items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Can&apos;t find a game?
                </h3>
                <SearchTrigger variant="field" className="w-full max-w-72" />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-sm">
                {links.map(({ key, node }) => (
                    <Fragment key={key}>{node}</Fragment>
                ))}
            </div>
        </div>
    );
};
