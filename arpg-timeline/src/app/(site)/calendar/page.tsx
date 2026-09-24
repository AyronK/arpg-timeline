import { CalendarSync } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { BuyMeACoffee } from "@/components/BuyMeACoffee";
import { CalendarAgendaMockup, CalendarEventMockup } from "@/components/CalendarMockups";
import { CalendarGameOption, CalendarSubscribePicker } from "@/components/CalendarSubscribePicker";
import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";
import { PatreonFunding } from "@/components/PatreonFunding";
import {
    ProtonCalendarAffiliation,
    ProtonCalendarInlineLink,
} from "@/components/ProtonCalendarAffiliation";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { cn } from "@/lib/utils";

const gamesQuery = `*[_type == "game" && defined(slug.current)] | order(name asc){
    name,
    "slug": slug.current,
    "logo": logo.asset->{_id, url},
    "categories": coalesce(categories, [])
}`;

const showcase = [
    {
        title: "Every launch, in your local time",
        text: "Each confirmed season start becomes an event with links to the season page and patch notes. Your calendar app shows it in your own time zone.",
        preview: (
            <CalendarEventMockup
                title="Ashen Kingdoms | Season 5 - Rise of the Frost launch"
                when="Thursday, October 1 · 18:00 – 19:00"
                links={[
                    "Season page: ashenkingdoms.com/season-5",
                    "Patch notes: ashenkingdoms.com/patch",
                ]}
                calendarName="arpg-timeline.com | Ashen Kingdoms"
                color="bg-emerald-500"
            />
        ),
        alt: "Calendar event for an upcoming season launch, with the start time, season page and patch notes links",
        caption: "Mockup of a season launch event",
    },
    {
        title: "Reveal streams too",
        text: "Developer livestreams land in the same calendar, with a link straight to the Twitch channel. No more finding out about the reveal after it happened.",
        preview: (
            <CalendarEventMockup
                title="Hollow Depths | Season 12 reveal | on Twitch"
                when="Friday, October 2 · 20:00 – 21:00"
                links={["Watch on Twitch: twitch.tv/hollowdepths"]}
                calendarName="arpg-timeline.com | Hollow Depths"
                color="bg-violet-500"
            />
        ),
        alt: "Calendar event for a developer livestream, with a link to the Twitch channel",
        caption: "Mockup of a livestream event",
    },
    {
        title: "Set it once, forget about it",
        text: "It's a subscription, not a download. When a date moves or a new season is announced, your calendar picks it up on its next sync.",
    },
];

const apps = [
    {
        name: "Google Calendar",
        steps: ["Open Settings", "Add calendar", "Choose From URL", "Paste the link"],
    },
    {
        name: "Apple Calendar",
        steps: ["File", "New Calendar Subscription", "Paste the link", "Set auto-refresh"],
    },
    {
        name: "Outlook",
        steps: ["Add calendar", "Choose Subscribe from web", "Paste the link"],
    },
    {
        name: "Proton Calendar",
        steps: ["Settings", "Calendars", "Add calendar from URL", "Paste the link"],
    },
];

type QA = { question: string; text: string; answer?: ReactNode };

const faq: QA[] = [
    {
        question: "Is it free?",
        text: "Yes. The calendar is free for personal use, with no account, ads or tracking.",
    },
    {
        question: "Can I follow only the games I play?",
        text: "Yes. Every game has its own calendar. Subscribe to each one you want, or pick All games to get everything in one.",
    },
    {
        question: "Which calendar apps are supported?",
        text: "Any app that can subscribe to an iCal (.ics) link, including Google Calendar, Apple Calendar, Outlook, Proton Calendar, Thunderbird, Fastmail and most phone calendars.",
    },
    {
        question: "How fast do changes show up?",
        text: "The feed updates daily, but your calendar app decides how often it checks. Apple lets you choose, Outlook refreshes every few hours, and Google can take up to a day.",
    },
    {
        question: "Why is a season missing?",
        text: "Only seasons with a confirmed start date are added. Once a date is announced, it shows up on the next sync.",
    },
    {
        question: "How do I unsubscribe?",
        text: "Remove the calendar in your calendar app's settings. There is nothing to cancel on our side.",
    },
    {
        question: "Can I use the feed in my website or app?",
        text: "Personal use is free. For commercial projects, please support via Patreon or contact us by email or Discord to discuss your use case. Please avoid excessive polling or redistributing the feed.",
        answer: (
            <>
                Personal use is free. For commercial projects, please consider{" "}
                <InlineLink href={process.env.NEXT_PUBLIC_PATREON_URL}>
                    supporting via Patreon
                </InlineLink>{" "}
                or reach out via{" "}
                <InlineLink
                    href={
                        process.env.NEXT_PUBLIC_CONTACT_EMAIL &&
                        `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`
                    }
                >
                    email
                </InlineLink>{" "}
                or <InlineLink href={process.env.NEXT_PUBLIC_DISCORD_URL}>Discord</InlineLink> to
                discuss your use case. Please avoid excessive polling or redistributing the feed.
            </>
        ),
    },
];

const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.text },
    })),
};

function InlineLink({ href, children }: { href?: string; children: ReactNode }) {
    if (!href) return <>{children}</>;
    return (
        <Link
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer nofollow"
            className="text-foreground underline underline-offset-2 hover:opacity-80"
        >
            {children}
        </Link>
    );
}

const SectionHeading = ({ title, intro }: { title: string; intro?: ReactNode }) => (
    <div className="mb-4">
        <h2 className="font-heading mb-4 border-b pb-2 text-2xl md:text-3xl">{title}</h2>
        {intro && <p className="text-muted-foreground max-w-prose leading-relaxed">{intro}</p>}
    </div>
);

const Section = ({
    id,
    title,
    intro,
    children,
}: {
    id?: string;
    title: string;
    intro?: ReactNode;
    children: ReactNode;
}) => (
    <section id={id} className="mx-auto mb-16 max-w-6xl scroll-mt-8 md:mb-24">
        <SectionHeading title={title} intro={intro} />
        {children}
    </section>
);

const Hero = ({ gameCount }: { gameCount: number }) => (
    <section className="mx-auto mb-16 grid max-w-6xl items-center gap-10 md:mb-24 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div className="flex flex-col items-start">
            <span className="bg-muted text-foreground mb-4 inline-flex items-center gap-1.5 rounded-lg border border-white/5 px-3 py-1 text-xs">
                <CalendarSync className="h-3.5 w-3.5 text-emerald-500" />
                Free · No account needed
            </span>
            <h1 className="font-heading mb-3 text-3xl leading-tight md:text-4xl">
                aRPG Season Calendar
            </h1>
            <p className="text-muted-foreground mb-6 max-w-prose leading-relaxed md:text-lg">
                Path of Exile 2 leagues, Diablo IV seasons, Last Epoch cycles and more, across{" "}
                {gameCount} games. Works with any calendar app that supports iCal, from Google and
                Apple to Outlook and Proton, and keeps itself up to date.
            </p>
            {/* Plain anchor: next/link hash navigation on the same page is unreliable */}
            <a
                href="#subscribe"
                data-sa-click="calendar-hero-subscribe"
                className={cn(getCtaBannerClassName("emerald"), "max-w-xl")}
            >
                <CtaBannerContent
                    icon={<CalendarSync className="m-auto h-5 w-5 opacity-70 md:h-6 md:w-6" />}
                    title="Subscribe in two clicks"
                    description="Click a game, then your calendar app."
                    actionLabel="Pick your games"
                    color="emerald"
                />
            </a>
        </div>
        <div className="order-first flex justify-center lg:order-none">
            <CalendarAgendaMockup className="mt-12 rounded-lg border shadow-[0_0_48px_-24px_#10b981] lg:scale-110" />
        </div>
    </section>
);

const Showcase = () => (
    <section className="mx-auto mb-16 flex max-w-6xl flex-col gap-12 md:mb-24 md:gap-20">
        {showcase.map((item, i) =>
            item.preview ? (
                <div
                    key={item.title}
                    className="reveal-on-scroll grid items-center gap-6 md:gap-12 lg:grid-cols-2"
                >
                    <div className={cn("max-w-prose", i % 2 === 1 && "lg:order-last")}>
                        <h2 className="font-heading mb-3 text-xl md:text-2xl">{item.title}</h2>
                        <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                    <figure className="flex min-w-0 flex-col items-center">
                        <div
                            role="img"
                            aria-label={item.alt}
                            className="flex w-full justify-center"
                        >
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
            ) : (
                <div key={item.title} className="reveal-on-scroll max-w-prose">
                    <h2 className="font-heading mb-3 text-xl md:text-2xl">{item.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
            ),
        )}
    </section>
);

const Manual = () => (
    <Section
        title="Adding it by hand"
        intro="Any app that can subscribe to an iCal (.ics) link will work. Copy the link from a game above, then add it as a subscription. Here's where to find that in popular apps."
    >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {apps.map((app) => (
                <div key={app.name}>
                    <h3 className="font-heading mb-2 text-lg font-semibold">{app.name}</h3>
                    <ol className="text-muted-foreground ml-5 list-decimal space-y-1 leading-relaxed">
                        {app.steps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                    {app.name === "Proton Calendar" && <ProtonCalendarInlineLink />}
                </div>
            ))}
        </div>
        <p className="text-muted-foreground mt-6 leading-relaxed">
            Using something else? Look for &quot;Add from URL&quot;, &quot;Subscribe to
            calendar&quot; or &quot;iCal&quot;.
        </p>
        <div className="mt-6">
            <ProtonCalendarAffiliation />
        </div>
    </Section>
);

const Faq = () => (
    <Section title="Questions">
        <div className="max-w-prose">
            {faq.map((q) => (
                <div key={q.question} className="mb-6 last:mb-0">
                    <h3 className="font-heading mb-2 text-lg font-semibold">{q.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{q.answer ?? q.text}</p>
                </div>
            ))}
        </div>
    </Section>
);

const Support = () => (
    <Section
        title="Enjoying the calendar?"
        intro="It's free, but hosting isn't. A small tip helps keep it running."
    >
        <div className="flex flex-col gap-4">
            <PatreonFunding />
            <BuyMeACoffee />
        </div>
    </Section>
);

const CalendarPage = async () => {
    const games: CalendarGameOption[] = await sanityFetch({ query: gamesQuery, tags: ["game"] });

    return (
        <div className="relative container mx-auto mb-12 py-8 md:py-12">
            <Hero gameCount={games.length} />
            <Section
                id="subscribe"
                title="Subscribe"
                intro="Click a game to subscribe. Want several? Add each one. They show up as separate calendars you can color and toggle."
            >
                <CalendarSubscribePicker games={games} />
            </Section>
            <Showcase />
            <Manual />
            <Faq />
            <Support />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </div>
    );
};

export default CalendarPage;

export const revalidate = false;
export const dynamic = "force-static";
