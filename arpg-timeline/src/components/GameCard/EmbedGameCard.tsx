"use client";
import Link from "next/link";
import { useEffect } from "react";

import { sa_event } from "@/lib/sa_event";

import ClientOnlyVisibleWrapper from "../ClientOnlyVisibleWrapper";
import { Logo } from "../Logo";
import { GameCardProps } from "./GameCard.types";

export const EmbedGameCard = ({ slug, gameLogo, children }: GameCardProps) => {
    function handleClick() {
        let hostname = "unknown";
        try {
            if (document.referrer) {
                hostname = new URL(document.referrer).hostname;
            }
        } finally {
            sa_event(`${slug}-embed-click`, { hostname });
        }
    }

    useEffect(() => {
        let hostname = "unknown";
        try {
            if (document.referrer) {
                hostname = new URL(document.referrer).hostname;
            }
        } finally {
            sa_event(`${slug}-embed-view`, { hostname });
        }
    }, [slug]);

    return (
        <ClientOnlyVisibleWrapper>
            <Link
                href={"https://www.arpg-timeline.com"}
                target="_blank"
                rel="noopener"
                className="z-10"
                onClick={handleClick}
            >
                <section className="text-card-foreground relative flex max-w-[720px] min-w-[350px] flex-1 flex-col gap-1 rounded-md bg-transparent p-4">
                    <div className="flex flex-col">
                        <div className="relative flex min-h-[80px] flex-1 flex-row items-center justify-between">
                            <div className="h-[72px] min-h-[72px] w-[120px]">{gameLogo}</div>
                            <div className="font-heading flex flex-row items-center opacity-50">
                                <Logo className="-mr-2 scale-50" />
                                <span className="text-nowrap">arpg-timeline.com</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-3">{children}</div>
                </section>
            </Link>
        </ClientOnlyVisibleWrapper>
    );
};
