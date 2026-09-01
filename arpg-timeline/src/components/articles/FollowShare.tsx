"use client";

import { Share2 } from "lucide-react";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa6";

import { addUTMParameters } from "@/lib/utm";
import { toast } from "@/ui/hooks/useToast";

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_medium: "share",
    utm_campaign: "article_share",
});

const iconClass =
    "bg-card text-foreground hover:border-border hover:text-primary flex size-10 cursor-pointer items-center justify-center rounded-lg border transition-all hover:shadow-sm";

export const FollowShare = ({ title, className }: { title: string; className?: string }) => {
    const share = async () => {
        const url = addUTM(window.location.href);
        if (navigator.share) {
            try {
                await navigator.share({ title, text: title, url });
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error("Error sharing:", error);
                }
            }
            return;
        }
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", withLogo: true, duration: 3000 });
    };

    return (
        <section className={className}>
            <p className="font-heading text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                Follow &amp; share
            </p>
            <div className="flex gap-2">
                {process.env.NEXT_PUBLIC_DISCORD_URL && (
                    <Link
                        href={process.env.NEXT_PUBLIC_DISCORD_URL}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        aria-label="Join the Discord"
                        data-sa-click="follow-discord"
                        className={iconClass}
                    >
                        <FaDiscord className="size-4" aria-hidden />
                    </Link>
                )}
                <button
                    type="button"
                    onClick={share}
                    aria-label="Share this article"
                    data-sa-click="article-share"
                    className={iconClass}
                >
                    <Share2 className="size-4" aria-hidden />
                </button>
            </div>
        </section>
    );
};
