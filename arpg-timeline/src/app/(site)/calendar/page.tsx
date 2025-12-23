"use client";

import { Check, Copy, Gamepad2, Rss } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { PatreonFunding } from "@/components/PatreonFunding";
import { cn } from "@/lib/utils";

const CalendarAppCard = ({ name, steps }: { name: string; steps: string[] }) => (
    <div className="bg-muted/50 flex min-w-48 flex-1 flex-col gap-2 rounded-md border px-4 py-3">
        <h3 className="text-foreground text-sm font-medium">{name}</h3>
        <ul className="text-muted-foreground list-inside list-disc space-y-0.5 text-xs">
            {steps.map((step, i) => (
                <li key={i}>{step}</li>
            ))}
        </ul>
    </div>
);

const AllGamesCard = () => {
    const [copied, setCopied] = useState(false);
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/calendar/subscribe`;

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [url]);

    return (
        <div
            role="button"
            onClick={handleCopy}
            className={cn(
                "text-card-foreground bg-card group flex cursor-pointer flex-col rounded-lg border-2 p-4 text-left transition-all md:p-6",
                "border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-md",
            )}
        >
            <div className="mb-4 flex items-center gap-3">
                <div className="bg-muted/50 grid h-10 w-10 shrink-0 place-content-center rounded-full md:h-12 md:w-12">
                    <Rss className="h-5 w-5 opacity-70 md:h-6 md:w-6" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                    <h2 className="font-heading text-foreground text-sm font-medium md:text-base">
                        All Games Calendar
                    </h2>
                    <p className="text-muted-foreground text-xs leading-tight md:text-sm">
                        Every aRPG season and stream in one feed
                    </p>
                </div>
                <div className="text-muted-foreground flex shrink-0 items-center gap-1 text-sm">
                    {copied ? (
                        <>
                            <Check className="h-4 w-4" />
                            <span className="hidden md:inline">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4" />
                            <span className="hidden md:inline">Click to copy</span>
                        </>
                    )}
                </div>
            </div>
            <code className="bg-muted/50 mx-auto block truncate rounded px-3 py-2 text-xs">
                {url}
            </code>
        </div>
    );
};

export default function CalendarPage() {
    return (
        <div className="py-8 md:py-12">
            <div className="container mx-auto mb-8 max-w-6xl text-center">
                <h1 className="font-heading mb-2 text-2xl md:text-3xl">Subscribe to Calendar</h1>
                <p className="text-muted-foreground text-sm md:text-base">
                    Get automatic updates for aRPG season launches and developer streams
                </p>
            </div>

            <div className="container mx-auto mb-6 grid gap-4 md:grid-cols-2">
                <AllGamesCard />

                <Link
                    href="/dashboard/all"
                    className={cn(
                        "text-card-foreground bg-card group flex flex-col rounded-lg border-2 p-4 transition-all md:p-6",
                        "border-sky-500/30 hover:border-sky-500/50 hover:shadow-md",
                    )}
                >
                    <div className="mb-4 flex items-center gap-3">
                        <div className="bg-muted/50 grid h-10 w-10 shrink-0 place-content-center rounded-full md:h-12 md:w-12">
                            <Gamepad2 className="h-5 w-5 opacity-70 md:h-6 md:w-6" />
                        </div>
                        <div className="flex flex-1 flex-col gap-0.5">
                            <h2 className="font-heading text-foreground text-sm font-medium md:text-base">
                                Single Game Calendar
                            </h2>
                            <p className="text-muted-foreground text-xs leading-tight md:text-sm">
                                Track only the games you care about
                            </p>
                        </div>
                        <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-sm">
                            Browse Games →
                        </span>
                    </div>
                    <p className="bg-muted/50 mx-auto block truncate rounded px-3 py-2 text-xs">
                        Visit any game page and click the calendar icon to get a game-specific link.
                    </p>
                </Link>
            </div>

            <div className="container mx-auto max-w-6xl">
                <div className="mb-6">
                    <h2 className="font-heading mb-3 text-lg">How to Subscribe</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap gap-3">
                            <CalendarAppCard
                                name="Google Calendar"
                                steps={[
                                    "Go to Settings",
                                    "Add calendar",
                                    "From URL",
                                    "Paste the URL",
                                ]}
                            />
                            <CalendarAppCard
                                name="Apple Calendar"
                                steps={[
                                    "Go to File menu",
                                    "New Calendar Subscription",
                                    "Paste the URL",
                                ]}
                            />
                            <CalendarAppCard
                                name="Outlook"
                                steps={["Add calendar", "Subscribe from web", "Paste the URL"]}
                            />
                            <CalendarAppCard
                                name="Proton Calendar"
                                steps={[
                                    "Go to Settings",
                                    "Calendars",
                                    "Add calendar from URL",
                                    "Paste the URL",
                                ]}
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <CalendarAppCard
                                name="Other Apps"
                                steps={[
                                    "Look for 'Add from URL' or 'Subscribe to calendar",
                                    "Read documentation or type in a web search",
                                ]}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <div className="bg-muted/50 rounded-md border px-4 py-3">
                        <h3 className="text-foreground mb-2 text-sm font-medium">
                            What&apos;s Included?
                        </h3>
                        <ul className="text-muted-foreground space-y-1.5 text-xs">
                            <li>✓ Season / league start dates for all aRPGs</li>
                            <li>✓ Developer livestream schedules</li>
                            <li>✓ Automatic updates - calendar syncs regularly</li>
                        </ul>
                    </div>

                    <div className="bg-muted/50 rounded-md border px-4 py-3">
                        <h3 className="text-foreground mb-2 text-sm font-medium">
                            Usage & Support
                        </h3>
                        <p className="text-muted-foreground mb-2 text-xs">
                            This calendar is free for personal use. If you&apos;re integrating it
                            into a commercial project, website, or app, please consider{" "}
                            <Link
                                href={process.env.NEXT_PUBLIC_PATREON_URL || "#"}
                                target="_blank"
                                rel="noopener"
                                className="text-foreground underline underline-offset-2"
                            >
                                supporting via Patreon
                            </Link>{" "}
                            or reaching out via{" "}
                            <Link
                                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                                className="text-foreground underline underline-offset-2"
                            >
                                email
                            </Link>{" "}
                            or{" "}
                            <Link
                                href={process.env.NEXT_PUBLIC_DISCORD_URL || "#"}
                                target="_blank"
                                rel="noopener"
                                className="text-foreground underline underline-offset-2"
                            >
                                Discord
                            </Link>{" "}
                            to discuss your use case.
                        </p>
                        <p className="text-muted-foreground text-xs opacity-70">
                            Please avoid excessive polling or redistributing the feed.
                        </p>
                    </div>
                </div>

                <PatreonFunding />
            </div>
        </div>
    );
}
