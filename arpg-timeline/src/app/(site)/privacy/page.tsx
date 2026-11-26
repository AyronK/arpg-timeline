import Link from "next/link";
import { ReactNode } from "react";

import { EmbedConsentSettings } from "@/components/EmbedConsentSettings";

const links = {
    email: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
    github: `${process.env.NEXT_PUBLIC_GITHUB_URL}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/issues`,
    discord: process.env.NEXT_PUBLIC_DISCORD_URL || "#",
    gdpr: "https://docs.simpleanalytics.com/gdpr",
    whatWeCollect: "https://docs.simpleanalytics.com/what-we-collect",
    metrics: "https://docs.simpleanalytics.com/metrics",
    discordPrivacy: "https://discord.com/privacy",
    uodo: "https://uodo.gov.pl/en",
};

const ExternalLink = ({
    href,
    saClick,
    children,
}: {
    href: string;
    saClick?: string;
    children: ReactNode;
}) => (
    <Link
        className="underline hover:opacity-80"
        href={href}
        rel="noopener noreferrer nofollow"
        target="_blank"
        data-sa-click={saClick}
    >
        {children}
    </Link>
);

const EmailLink = ({ children = "email" }: { children?: ReactNode }) => (
    <Link
        className="underline hover:opacity-80"
        href={links.email}
        rel="noopener noreferrer nofollow"
        data-sa-click="privacy-email"
    >
        {children}
    </Link>
);

const Block = ({ id, title, children }: { id?: string; title: string; children: ReactNode }) => (
    <div id={id} className="scroll-mt-8 space-y-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        {children}
    </div>
);

const Basis = ({ children }: { children: ReactNode }) => (
    <p className="text-muted-foreground text-sm">{children}</p>
);

const PrivacyPage = () => {
    return (
        <div className="relative container mx-auto mb-8">
            <section className="container flex flex-col gap-4 md:my-16">
                <h1 className="mb-4 text-center text-3xl font-semibold">Privacy</h1>
                <div className="mx-auto mt-8 max-w-prose space-y-10 text-base leading-relaxed">
                    <p className="text-muted-foreground text-sm">Last updated: November 26, 2026</p>
                    <p>
                        At <i>arpg-timeline.com</i>, your privacy is important. This page outlines
                        how information is collected and used when you visit the site or use its
                        services.
                    </p>

                    <Block title="1. Who Runs This Site">
                        <p>
                            aRPG Timeline is a hobby project run by Marcin Kotlicki, a private
                            individual in Poland. There is no company behind it. He is responsible
                            for the personal data described on this page.
                        </p>
                        <p>
                            For any privacy question or request, contact him by <EmailLink />. You
                            can also reach out on{" "}
                            <ExternalLink href={links.github} saClick="github">
                                GitHub
                            </ExternalLink>{" "}
                            or{" "}
                            <ExternalLink href={links.discord} saClick="privacy-discord">
                                Discord
                            </ExternalLink>
                            , but these are public, so don&apos;t share personal details there.
                        </p>
                    </Block>

                    <Block title="2. Hosting and Security">
                        <p>
                            The site is hosted on Vercel. Like most websites, the hosting
                            infrastructure processes your IP address, browser details and the pages
                            you request in server logs, to deliver the site and protect it from
                            abuse and automated traffic. Vercel may also set a strictly necessary
                            security cookie for the same reason. Server logs available to us are
                            kept for 1 day. This also applies to widgets embedded on other websites
                            and to calendar feeds.
                        </p>
                        <p>
                            Some images, such as game logos, load from the content system the site
                            uses (Sanity), which also receives your IP address to deliver them.
                        </p>
                        <Basis>Legal basis: legitimate interest in running a secure website.</Basis>
                    </Block>

                    <Block title="3. Analytics">
                        <p>
                            We do not use cookies for tracking, analytics, or advertising. We use
                            Simple Analytics to help us understand website usage. It provides
                            anonymous metrics only and does not store IP addresses. Read more{" "}
                            <ExternalLink href={links.gdpr} saClick="privacy-gdpr">
                                here
                            </ExternalLink>
                            .
                        </p>
                        <p>
                            By default, we do <strong>not</strong> collect any data if a visitor has{" "}
                            <i>Do Not Track</i> enabled. Otherwise, we collect only the following
                            anonymous metrics:
                        </p>
                        <ul className="list-inside list-disc space-y-2">
                            <li>Whether visits are unique</li>
                            <li>Timestamps of visits</li>
                            <li>Anonymized user agents</li>
                            <li>Country of visitor</li>
                            <li>Language of the visitor</li>
                            <li>Partial referrer information</li>
                            <li>Device screen dimensions</li>
                            <li>Page view duration</li>
                            <li>Clicks on some links and buttons, such as outbound links</li>
                        </ul>
                        <p>
                            You can read a thorough report{" "}
                            <ExternalLink
                                href={links.whatWeCollect}
                                saClick="privacy-what-we-collect"
                            >
                                here
                            </ExternalLink>{" "}
                            and{" "}
                            <ExternalLink href={links.metrics} saClick="privacy-metrics">
                                here
                            </ExternalLink>
                            .
                        </p>
                        <Basis>
                            Legal basis: legitimate interest in understanding how the site is used.
                        </Basis>
                    </Block>

                    <Block title="4. Preferences on Your Device">
                        <p>
                            This website uses local storage to remember user preferences like theme
                            or filters, and your choices about embedded content. No personal data is
                            stored or transmitted - it stays on your device.
                        </p>
                    </Block>

                    <Block id="embeds" title="5. Embedded Content">
                        <p>
                            Some pages can show content from Steam, SteamDB and YouTube. It only
                            loads after you click to load it, because these services may set cookies
                            and receive your IP address. If you choose to always load content from a
                            service, that choice is saved in your browser&apos;s local storage. You
                            can change it here at any time.
                        </p>
                        <EmbedConsentSettings />
                        <Basis>
                            Legal basis: your consent, which you can withdraw with the switches
                            above.
                        </Basis>
                    </Block>

                    <Block id="discord-bot" title="6. Discord Bot">
                        <p>
                            The aRPG Timeline Discord bot only stores what it needs to add season
                            events to your server. For each server it is added to, it keeps:
                        </p>
                        <ul className="list-inside list-disc space-y-2">
                            <li>The server ID</li>
                            <li>Whether the bot is turned on, and which games are selected</li>
                            <li>
                                The IDs of the events it created, so it can update or remove them
                                later
                            </li>
                        </ul>
                        <p>
                            The bot does <strong>not</strong> store message content, member lists or
                            online status.
                        </p>
                        <p>
                            If you send feedback with the <code>/feedback</code> command, your
                            message is forwarded privately to the maintainer on Discord, together
                            with your Discord account details (username, user ID, avatar and account
                            age) and the name, ID and member count of the server you sent it from.
                            Feedback is kept until it has been dealt with, and deleted within 90
                            days at the latest.
                        </p>
                        <p>
                            The bot runs on Fly.io and keeps technical logs that include server IDs
                            and errors. They are used only to fix problems and are not shared. Logs
                            are size-limited and overwritten as new ones arrive, and the host&apos;s
                            copy is deleted after 7 days.
                        </p>
                        <p>
                            All stored data for a server is deleted automatically when the bot is
                            removed from it. To have it deleted earlier, contact us on{" "}
                            <ExternalLink href={links.discord} saClick="privacy-discord">
                                Discord
                            </ExternalLink>{" "}
                            or by <EmailLink />. Discord itself also processes data under its own{" "}
                            <ExternalLink href={links.discordPrivacy}>Privacy Policy</ExternalLink>.
                        </p>
                        <Basis>
                            Legal basis: legitimate interest in running the bot and handling
                            feedback.
                        </Basis>
                    </Block>

                    <Block title="7. Supporters">
                        <p>
                            If you support the project on Patreon or Buy Me a Coffee, those services
                            handle your payment under their own privacy policies and share your name
                            and email address with us. Supporters are thanked by name on the site,
                            sometimes with a link to their Twitch channel, until they ask to be
                            removed. If you&apos;d rather not be listed, or want a different name
                            shown, send an <EmailLink /> and it will be changed.
                        </p>
                        <Basis>Legal basis: legitimate interest in thanking supporters.</Basis>
                    </Block>

                    <Block title="8. API Access">
                        <p>
                            API credentials are issued by hand, to patrons and to people who ask for
                            access. For each, we store (with Supabase, our database provider) a
                            client name, a secret, an ID we assign and the permissions granted, plus
                            a daily count of requests. Credentials are kept while access is active;
                            request counts are kept until you ask for them to be deleted.
                        </p>
                        <Basis>Legal basis: providing the API access you asked for.</Basis>
                    </Block>

                    <Block title="9. Contacting Us">
                        <p>
                            If you send an email or message, it is used only to reply and kept as
                            long as needed for the conversation. GitHub issues and Discord server
                            messages are public and stay under those services&apos; own policies.
                        </p>
                        <Basis>Legal basis: legitimate interest in answering you.</Basis>
                    </Block>

                    <Block title="10. Data Outside the EU">
                        <p>
                            Several services mentioned on this page are based outside the European
                            Union, mainly in the United States. Where data reaches them, the
                            transfer relies on the EU-US Data Privacy Framework or the European
                            Commission&apos;s Standard Contractual Clauses.
                        </p>
                    </Block>

                    <Block title="11. Your Rights">
                        <p>Under the GDPR, you have the right to:</p>
                        <ul className="list-inside list-disc space-y-2">
                            <li>Access the personal data held about you</li>
                            <li>Have it corrected or deleted</li>
                            <li>Restrict or object to its processing</li>
                            <li>Receive it in a portable format</li>
                            <li>Withdraw consent at any time, without affecting earlier use</li>
                        </ul>
                        <p>
                            <strong>
                                Where processing is based on legitimate interest, you can object to
                                it at any time.
                            </strong>
                        </p>
                        <p>No automated decision-making or profiling takes place.</p>
                        <p>
                            To use any of these rights, send an <EmailLink />. You can also complain
                            to the Polish data protection authority,{" "}
                            <ExternalLink href={links.uodo}>
                                Prezes Urzędu Ochrony Danych Osobowych (UODO)
                            </ExternalLink>
                            , ul. Stawki 2, 00-193 Warszawa.
                        </p>
                    </Block>

                    <Block title="12. Changes to This Page">
                        <p>
                            This page is updated when the site&apos;s use of data changes. The date
                            at the top shows the latest update.
                        </p>
                    </Block>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPage;

export const revalidate = false;
