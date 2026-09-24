import { BadgeCheck } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { BuyMeACoffee } from "@/components/BuyMeACoffee";
import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";
import { DiscordMemberCard } from "@/components/DiscordMemberCard";
import { DiscordContactBanner } from "@/components/DiscordServerBoost";
import { PatreonFunding } from "@/components/PatreonFunding";
import { cn } from "@/lib/utils";

const SITE_URL = "https://www.arpg-timeline.com";
const INVITE_URL = process.env.NEXT_PUBLIC_DISCORD_BOT_INVITE_URL;
const TOPGG_URL = process.env.NEXT_PUBLIC_TOPGG_BOT_ID
    ? `https://top.gg/bot/${process.env.NEXT_PUBLIC_TOPGG_BOT_ID}`
    : undefined;
const SOURCE_URL = "https://github.com/AyronK/arpg-timeline-discord-bot";
const JOSH_GITHUB_URL = "https://github.com/svn-josh";
const JOSH_WEBSITE_URL = "https://developer-josh.de";

const DESCRIPTION =
    "Free Discord bot that adds Path of Exile 2, Diablo 4, Last Epoch and other aRPG season launches to your server's Events tab. Pick your games, stay on time.";

export const metadata: Metadata = {
    title: "aRPG Discord Bot | Season Launch Events for Your Server",
    description: DESCRIPTION,
    keywords: [
        "arpg discord bot",
        "poe 2 discord bot",
        "path of exile discord bot",
        "diablo 4 season discord bot",
        "last epoch discord bot",
        "season tracker bot",
        "discord season events",
        "league start discord bot",
    ],
    openGraph: {
        title: "aRPG Timeline Discord Bot",
        description:
            "Never miss a season launch. New aRPG seasons show up as events in your Discord server.",
        siteName: "aRPG Timeline",
        type: "website",
        url: `${SITE_URL}/discord-bot`,
        locale: "en_US",
        images: [
            {
                url: "/assets/seoimage.png",
                width: 1200,
                height: 630,
                alt: "aRPG Timeline Discord Bot",
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "aRPG Timeline Discord Bot",
        description:
            "New aRPG seasons show up as events in your Discord server. Free and easy to set up.",
        images: ["/assets/seoimage.png"],
    },
    alternates: { canonical: "/discord-bot" },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

const showcase = [
    {
        title: "Seasons show up as server events",
        text: "Every new season becomes an event in your server's Events tab, with the start time and useful links. If a date changes, the event updates too.",
        src: "/assets/discord-bot/event-card.png",
        alt: "Discord scheduled event for an upcoming aRPG season created by the bot",
        width: 802,
        height: 420,
    },
    {
        title: "Only the games you play",
        text: "Pick games from a simple menu. Everything is off until you turn it on, so your server only gets what it cares about.",
        src: "/assets/discord-bot/toggle-game.png",
        alt: "The /arpg-toggle-game menu for choosing which games to follow",
        width: 789,
        height: 550,
    },
    {
        title: "See what's coming",
        text: "Type /arpg-seasons to see current and upcoming seasons at a glance.",
        src: "/assets/discord-bot/seasons.png",
        alt: "The /arpg-seasons command listing current and upcoming seasons",
        width: 833,
        height: 723,
    },
];

const steps: ReactNode[] = [
    <>
        Click <strong>Add to Discord</strong> and pick your server.
    </>,
    <>
        Type <code>/arpg-toggle-game</code> and choose your games.
    </>,
    <>
        Type <code>/arpg-enable true</code> to turn it on.
    </>,
    <>Done! New seasons appear in your Events tab within 15 minutes.</>,
];

const commands = [
    { name: "/arpg-seasons", text: "See current and upcoming seasons" },
    { name: "/arpg-status", text: "See your server's settings" },
    { name: "/arpg-toggle-game", text: "Choose games (owner)" },
    { name: "/arpg-enable", text: "Turn it on or off (owner)" },
];

const permissions = [
    { name: "Manage Events", text: "Manage scheduled events" },
    { name: "Create Events", text: "Create scheduled events" },
    { name: "Send Messages", text: "Send notifications" },
    { name: "Embed Links", text: "Rich message formatting" },
];

const troubleshooting: { problem: string; fix: ReactNode }[] = [
    {
        problem: "Why aren't any events showing up?",
        fix: (
            <>
                Type <code>/arpg-check-permissions</code>. If something is missing, go to Server
                Settings → Roles → aRPG Timeline and turn on Manage Events and Create Events.
            </>
        ),
    },
    {
        problem: "Permissions look fine, but still no events?",
        fix: (
            <>
                Type <code>/arpg-status</code>. Make sure the bot is enabled and at least one game
                is turned on. Games are off by default.
            </>
        ),
    },
    {
        problem: "It says “Only the server owner can use this command”",
        fix: (
            <>
                Ask your server owner to run <code>/arpg-toggle-game</code> and{" "}
                <code>/arpg-enable</code>.
            </>
        ),
    },
    {
        problem: "Why is a season missing?",
        fix: "The bot only adds seasons that haven't started yet and have a confirmed start date.",
    },
];

const structuredData = [
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/discord-bot#app`,
        name: "aRPG Timeline Discord Bot",
        description: DESCRIPTION,
        url: `${SITE_URL}/discord-bot`,
        applicationCategory: "CommunicationApplication",
        operatingSystem: "Discord",
        ...(INVITE_URL && { installUrl: INVITE_URL }),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: showcase.map((f) => f.title),
        author: { "@type": "Person", name: "Josh", url: JOSH_GITHUB_URL },
        maintainer: { "@type": "Organization", name: "aRPG Timeline", url: SITE_URL },
    },
    {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to set up the aRPG Timeline Discord Bot",
        step: [
            "Add the bot to your Discord server.",
            "Type /arpg-toggle-game and choose your games.",
            "Type /arpg-enable true to turn it on.",
            "New seasons appear in your server's Events tab within 15 minutes.",
        ].map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
    },
];

const TopggLogo = ({ className }: { className?: string }) => (
    <svg viewBox="120 120 580 580" fill="none" aria-hidden className={className}>
        <path
            fill="currentColor"
            d="M655.711 247H330.71V572H397.113C422.599 572 447.042 561.876 465.064 543.854C483.086 525.832 493.21 501.389 493.21 475.902V409.5H559.613C585.099 409.5 609.542 399.375 627.564 381.354C645.586 363.332 655.711 338.889 655.711 313.402V247Z"
        />
        <path
            fill="currentColor"
            d="M144 247H306.5V409.5H193.657C180.531 409.5 167.943 404.286 158.661 395.004C149.379 385.722 144.165 373.134 144.165 360.008L144 247Z"
        />
    </svg>
);

const SectionHeading = ({ title, intro }: { title: string; intro?: ReactNode }) => (
    <div className="mb-4">
        <h2 className="font-heading mb-4 border-b pb-2 text-2xl md:text-3xl">{title}</h2>
        {intro && <p className="text-muted-foreground max-w-prose leading-relaxed">{intro}</p>}
    </div>
);

const Section = ({
    title,
    intro,
    children,
}: {
    title: string;
    intro?: ReactNode;
    children: ReactNode;
}) => (
    <section className="mx-auto mb-16 max-w-6xl md:mb-24">
        <SectionHeading title={title} intro={intro} />
        {children}
    </section>
);

const Hero = () => (
    <section className="mx-auto mb-16 flex max-w-6xl flex-col items-center text-center md:mb-24">
        <span className="bg-muted text-foreground mb-2 inline-flex items-center gap-1.5 rounded-lg border border-white/5 px-3 py-1 text-xs">
            <BadgeCheck className="h-3.5 w-3.5 text-indigo-500" />
            Verified Discord app
        </span>
        <div className="pointer-events-none">
            <DiscordMemberCard
                name="aRPG Timeline"
                status="preparing the next event!"
                className="mb-6"
            />
        </div>
        <div className="flex max-w-prose flex-col items-center">
            <h1 className="font-heading mb-2 text-2xl md:text-3xl">aRPG Timeline Discord Bot</h1>
            <p className="text-muted-foreground mb-4 text-sm text-balance md:text-base">
                Never miss a season launch. The bot adds new aRPG seasons to your server&apos;s
                Events tab.
            </p>
        </div>
        {(INVITE_URL || TOPGG_URL) && (
            <div
                className={cn(
                    "grid w-full gap-4 text-left",
                    INVITE_URL && TOPGG_URL ? "md:grid-cols-2" : "max-w-xl",
                )}
            >
                {INVITE_URL && (
                    <Link
                        href={INVITE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-sa-click="discord-bot-invite"
                        className={getCtaBannerClassName("indigo")}
                    >
                        <CtaBannerContent
                            icon={
                                <Image
                                    unoptimized
                                    src="/assets/third-party/discord-logo.svg"
                                    className="m-auto h-6 w-6 md:h-7 md:w-7"
                                    alt="Discord logo"
                                    width={32}
                                    height={32}
                                />
                            }
                            title="Add to your server"
                            description="Free and ready in a minute."
                            actionLabel="Add to Discord"
                            color="indigo"
                        />
                    </Link>
                )}
                {TOPGG_URL && (
                    <Link
                        href={TOPGG_URL}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        data-sa-click="discord-bot-topgg"
                        className={getCtaBannerClassName("rose")}
                    >
                        <CtaBannerContent
                            icon={
                                <TopggLogo className="m-auto h-6 w-6 text-[#f36] md:h-7 md:w-7" />
                            }
                            title="Vote on top.gg"
                            description="Help other communities find the bot."
                            actionLabel="Open top.gg"
                            color="rose"
                        />
                    </Link>
                )}
            </div>
        )}
    </section>
);

const Showcase = () => (
    <section className="mx-auto mb-16 flex max-w-6xl flex-col gap-12 md:mb-24 md:gap-20">
        {showcase.map((item, i) => (
            <div key={item.src} className="grid items-center gap-6 md:gap-12 lg:grid-cols-2">
                <div className={cn("max-w-prose", i % 2 === 1 && "lg:order-last")}>
                    <h2 className="font-heading mb-3 text-xl md:text-2xl">{item.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
                <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="mx-auto h-auto w-full max-w-xl rounded-lg"
                />
            </div>
        ))}
    </section>
);

const Setup = () => (
    <Section title="Set it up">
        <ol className="mb-4 ml-6 max-w-prose list-decimal space-y-2">
            {steps.map((step, i) => (
                <li key={i} className="leading-relaxed">
                    {step}
                </li>
            ))}
        </ol>
        <p className="text-muted-foreground max-w-prose leading-relaxed">
            Steps 2 and 3 must be done by the server owner. Something not working? See{" "}
            <Link href="#troubleshooting" className="text-foreground underline underline-offset-2">
                troubleshooting
            </Link>
            .
        </p>
    </Section>
);

const CommandsAndPermissions = () => (
    <section className="mx-auto mb-16 grid max-w-6xl gap-12 md:mb-24 lg:grid-cols-2 lg:gap-16">
        <div>
            <SectionHeading
                title="Commands"
                intro={
                    <>
                        Type these in any channel. <code>/help</code> shows the full list.
                    </>
                }
            />
            <ul className="mb-4 ml-6 list-disc space-y-2">
                {commands.map((c) => (
                    <li key={c.name} className="leading-relaxed">
                        <code>{c.name}</code> – {c.text}
                    </li>
                ))}
            </ul>
        </div>
        <div>
            <SectionHeading
                title="Permissions"
                intro="Only what's needed to post events. No admin or moderation rights."
            />
            <ul className="mb-4 ml-6 list-disc space-y-2">
                {permissions.map((p) => (
                    <li key={p.name} className="leading-relaxed">
                        <strong className="font-semibold">{p.name}</strong> – {p.text}
                    </li>
                ))}
            </ul>
        </div>
    </section>
);

const Troubleshooting = () => (
    <section id="troubleshooting" className="mx-auto mb-16 max-w-6xl scroll-mt-8 md:mb-24">
        <SectionHeading title="Troubleshooting" />
        <div className="max-w-prose">
            {troubleshooting.map((t) => (
                <div key={t.problem} className="mb-6 last:mb-0">
                    <h3 className="font-heading mb-2 text-lg font-semibold">{t.problem}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t.fix}</p>
                </div>
            ))}
        </div>
    </section>
);

const CreditLink = ({ href, children }: { href: string; children: ReactNode }) => (
    <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground text-xs underline underline-offset-2 hover:opacity-80 md:text-sm"
    >
        {children}
    </Link>
);

const CreditRow = ({
    avatar,
    title,
    text,
    links,
}: {
    avatar: string;
    title: ReactNode;
    text: string;
    links: ReactNode;
}) => (
    <div className="flex items-center gap-4">
        <Image
            src={avatar}
            alt=""
            width={64}
            height={64}
            className="h-12 w-12 shrink-0 rounded-full border md:h-14 md:w-14"
        />
        <div className="flex flex-1 flex-col gap-1">
            <h3 className="font-heading text-foreground text-sm font-medium md:text-base">
                {title}
            </h3>
            <p className="text-muted-foreground text-xs md:text-sm">{text}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">{links}</div>
        </div>
    </div>
);

const Credits = () => (
    <Section title="Credits">
        <div className="grid gap-8 md:grid-cols-2">
            <CreditRow
                avatar="/assets/discord-bot/josh.png"
                title="Created by Josh"
                text="Thanks, Josh, for building this for the aRPG community!"
                links={
                    <>
                        <CreditLink href={JOSH_GITHUB_URL}>GitHub</CreditLink>
                        <CreditLink href={JOSH_WEBSITE_URL}>Website</CreditLink>
                    </>
                }
            />
            <CreditRow
                avatar="/assets/discord-bot/ayronk.png"
                title="Maintained by aRPG Timeline (AyronK)"
                text="Officially hosted, maintained and improved by aRPG Timeline."
                links={
                    <>
                        {process.env.NEXT_PUBLIC_GITHUB_URL && (
                            <CreditLink href={process.env.NEXT_PUBLIC_GITHUB_URL}>
                                GitHub
                            </CreditLink>
                        )}
                        <CreditLink href={SOURCE_URL}>Project</CreditLink>
                    </>
                }
            />
        </div>
    </Section>
);

const Support = () => (
    <Section
        title="Enjoying the bot?"
        intro="It's free, but hosting isn't. A small tip helps keep it running."
    >
        <div className="flex flex-col gap-4">
            <PatreonFunding />
            <BuyMeACoffee />
            <DiscordContactBanner />
        </div>
    </Section>
);

const DiscordBotPage = () => (
    <div className="[&_code]:bg-muted relative container mx-auto mb-12 py-8 md:py-12 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]">
        <Hero />
        <Showcase />
        <Setup />
        <CommandsAndPermissions />
        <Troubleshooting />
        <Credits />
        <Support />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    </div>
);

export default DiscordBotPage;

export const revalidate = false;
export const dynamic = "force-static";
