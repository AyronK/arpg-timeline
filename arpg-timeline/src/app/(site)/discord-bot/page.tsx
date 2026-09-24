import { BadgeCheck } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { BuyMeACoffee } from "@/components/BuyMeACoffee";
import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";
import { DiscordBotHeroCard } from "@/components/DiscordBotHeroCard";
import {
    DiscordEventMockup,
    DiscordGameConfigMockup,
    DiscordSeasonsMockup,
} from "@/components/DiscordMockups";
import { DiscordContactBanner } from "@/components/DiscordServerBoost";
import { PatreonFunding } from "@/components/PatreonFunding";
import { sanityFetch } from "@/lib/sanity/sanityClient";
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
    "Free Discord bot for Path of Exile, PoE 2, Diablo IV, Last Epoch and other aRPGs. New league and season starts show up as events in your server.";

export const metadata: Metadata = {
    title: "Path of Exile & Diablo Season Discord Bot | aRPG Timeline",
    description: DESCRIPTION,
    keywords: [
        "arpg discord bot",
        "path of exile discord bot",
        "poe discord bot",
        "poe 2 discord bot",
        "path of exile 2 league start discord bot",
        "poe league start notification discord",
        "diablo 4 discord bot",
        "diablo 4 season discord bot",
        "diablo 2 resurrected ladder discord bot",
        "last epoch discord bot",
        "torchlight infinite discord bot",
        "season tracker discord bot",
        "league start reminder discord",
        "discord season events bot",
    ],
    openGraph: {
        title: "aRPG Season Tracker Discord Bot",
        description:
            "Path of Exile, PoE 2, Diablo IV, Last Epoch and more. New seasons show up as events in your Discord server.",
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
        title: "aRPG Season Tracker Discord Bot",
        description:
            "Path of Exile, PoE 2, Diablo IV, Last Epoch and more. New seasons show up as events in your Discord server.",
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

const gamesQuery = `*[_type == "game" && defined(slug.current)] | order(name asc){name, "slug": slug.current}`;

type GameLink = { name: string; slug: string };

const showcase = [
    {
        title: "Seasons show up as server events",
        text: "Every new season becomes an event in your server's Events tab, with the start time and useful links. If a date changes, the event updates too.",
        preview: <DiscordEventMockup />,
        alt: "Discord scheduled event created by the bot for an upcoming season, with the start date, season links and an Interested button",
        caption: "Mockup of a Discord scheduled event created by the bot",
    },
    {
        title: "Only the games you play",
        text: "Pick games from a simple menu. Everything is off until you turn it on, so your server only gets what it cares about.",
        preview: <DiscordGameConfigMockup />,
        alt: "The bot's game configuration message in Discord, showing enabled games, page navigation and how to toggle games",
        caption: "Mockup of the /arpg-toggle-game menu in Discord",
    },
    {
        title: "See what's coming",
        text: "Type /arpg-seasons to see current and upcoming seasons at a glance.",
        preview: <DiscordSeasonsMockup />,
        alt: "The bot's reply to /arpg-seasons in Discord, listing upcoming seasons with start dates, status and timeline links",
        caption: "Mockup of the /arpg-seasons reply in Discord",
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

type QA = { question: string; answer: string };

const faq: QA[] = [
    {
        question: "Is there a Discord bot for Path of Exile league starts?",
        answer: "Yes. The aRPG Timeline bot adds every new Path of Exile and Path of Exile 2 league to your server's Events tab, shown in each member's local time.",
    },
    {
        question: "Can I follow only some games?",
        answer: "Yes. Turn on just the games your server plays, say Path of Exile 2 and Diablo IV, and everything else stays off.",
    },
    {
        question: "Will my members get a reminder?",
        answer: "Yes. Anyone who clicks Interested on an event gets a Discord notification when the season starts.",
    },
    {
        question: "Is the bot free?",
        answer: "Yes, completely free. It's hosted and maintained by aRPG Timeline.",
    },
];

const troubleshooting: QA[] = [
    {
        question: "Why aren't any events showing up?",
        answer: "Type /arpg-check-permissions. If something is missing, go to Server Settings → Roles → aRPG Timeline and turn on Manage Events and Create Events.",
    },
    {
        question: "Permissions look fine, but still no events?",
        answer: "Type /arpg-status. Make sure the bot is enabled and at least one game is turned on. Games are off by default.",
    },
    {
        question: "It says “Only the server owner can use this command”",
        answer: "Ask your server owner to run /arpg-toggle-game and /arpg-enable.",
    },
    {
        question: "Why is a season missing?",
        answer: "The bot only adds seasons that haven't started yet and have a confirmed start date.",
    },
];

// Wraps slash commands in <code>
const withCode = (text: string) =>
    text
        .split(/(\/[a-z][a-z-]*(?: true)?)/g)
        .map((part, i) => (part.startsWith("/") ? <code key={i}>{part}</code> : part));

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
        keywords:
            "Path of Exile, Path of Exile 2, Diablo IV, Diablo II: Resurrected, Last Epoch, aRPG, Discord bot, season tracker",
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
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [...faq, ...troubleshooting].map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
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

const Hero = ({ gameCount }: { gameCount: number }) => (
    <section className="mx-auto mb-16 grid max-w-6xl items-center gap-10 md:mb-24 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div className="flex flex-col items-start">
            <span className="bg-muted text-foreground mb-4 inline-flex items-center gap-1.5 rounded-lg border border-white/5 px-3 py-1 text-xs">
                <BadgeCheck className="h-3.5 w-3.5 text-indigo-500" />
                Verified Discord app
            </span>
            <h1 className="font-heading mb-3 text-3xl leading-tight md:text-4xl">
                aRPG Season Tracker Discord Bot
            </h1>
            <p className="text-muted-foreground mb-6 max-w-prose leading-relaxed md:text-lg">
                Never miss a league or season launch. The bot adds new Path of Exile 2, Diablo IV,
                Last Epoch and other aRPG seasons to your server&apos;s Events tab.
            </p>
            {INVITE_URL && (
                <Link
                    href={INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-sa-click="discord-bot-invite"
                    className={cn(getCtaBannerClassName("indigo"), "max-w-xl")}
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
                    className="text-muted-foreground hover:text-foreground mt-4 inline-flex items-center gap-2 text-sm transition-colors"
                >
                    <TopggLogo className="h-4 w-4 text-[#f36]" />
                    Like it? Vote for the bot on top.gg
                    <span aria-hidden>→</span>
                </Link>
            )}
            <p className="text-muted-foreground mt-4 text-xs">
                By adding the bot you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-2 hover:opacity-80">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="/privacy#discord-bot"
                    className="underline underline-offset-2 hover:opacity-80"
                >
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
        <div className="order-first flex justify-center lg:order-none">
            <DiscordBotHeroCard
                className="lg:scale-125"
                inviteUrl={INVITE_URL}
                statuses={[
                    "preparing the next event!",
                    `watching ${gameCount} games`,
                    "syncing season dates",
                    "counting down to the next league",
                ]}
            />
        </div>
    </section>
);

const Showcase = () => (
    <section className="mx-auto mb-16 flex max-w-6xl flex-col gap-12 md:mb-24 md:gap-20">
        {showcase.map((item, i) => (
            <div
                key={item.title}
                className="reveal-on-scroll grid items-center gap-6 md:gap-12 lg:grid-cols-2"
            >
                <div className={cn("max-w-prose", i % 2 === 1 && "lg:order-last")}>
                    <h2 className="font-heading mb-3 text-xl md:text-2xl">{item.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{withCode(item.text)}</p>
                </div>
                <figure className="flex flex-col items-center">
                    <div role="img" aria-label={item.alt} className="flex w-full justify-center">
                        {item.preview}
                    </div>
                    <figcaption className="text-muted-foreground mt-2 text-center text-sm text-balance">
                        {item.caption}
                        <span className="block text-xs opacity-80">
                            Illustration only. Games and details are made up.
                        </span>
                    </figcaption>
                </figure>
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
        <p className="text-muted-foreground leading-relaxed">
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

const QuestionList = ({ items }: { items: QA[] }) => (
    <div className="max-w-prose">
        {items.map((q) => (
            <div key={q.question} className="mb-6 last:mb-0">
                <h3 className="font-heading mb-2 text-lg font-semibold">{q.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{withCode(q.answer)}</p>
            </div>
        ))}
    </div>
);

const SupportedGames = ({ games }: { games: GameLink[] }) => (
    <section id="supported-games" className="mx-auto mb-16 max-w-6xl scroll-mt-8 md:mb-24">
        <SectionHeading
            title="Supported games and community servers"
            intro="The bot follows every game tracked on aRPG Timeline, from Path of Exile and Diablo to smaller indie aRPGs."
        />
        <ul className="flex flex-wrap gap-y-1 leading-relaxed sm:ml-6 sm:block sm:list-disc sm:columns-2 sm:space-y-2 sm:gap-x-8 lg:columns-3">
            {games.map((g) => (
                <li
                    key={g.slug}
                    className="after:text-muted-foreground break-inside-avoid after:mx-2 after:content-['·'] last:after:content-none sm:after:content-none"
                >
                    <Link
                        href={`/game/${g.slug}`}
                        className="hover:text-primary underline-offset-2 hover:underline"
                    >
                        {g.name}
                    </Link>
                </li>
            ))}
        </ul>
    </section>
);

const Faq = () => (
    <section className="mx-auto mb-16 max-w-6xl md:mb-24">
        <SectionHeading title="Questions" />
        <QuestionList items={faq} />
    </section>
);

const Troubleshooting = () => (
    <section id="troubleshooting" className="mx-auto mb-16 max-w-6xl scroll-mt-8 md:mb-24">
        <SectionHeading title="Troubleshooting" />
        <QuestionList items={troubleshooting} />
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

const DiscordBotPage = async () => {
    const games: GameLink[] = await sanityFetch({ query: gamesQuery, tags: ["game"] });

    return (
        <div className="[&_code]:bg-muted relative container mx-auto mb-12 py-8 md:py-12 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]">
            <Hero gameCount={games.length} />
            <Showcase />
            <Setup />
            <CommandsAndPermissions />
            <SupportedGames games={games} />
            <Faq />
            <Troubleshooting />
            <Credits />
            <Support />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </div>
    );
};

export default DiscordBotPage;

export const revalidate = false;
export const dynamic = "force-static";
