import Link from "next/link";

const links = {
    gdpr: "https://docs.simpleanalytics.com/gdpr",
    github: `${process.env.NEXT_PUBLIC_GITHUB_URL}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/issues`,
    whatWeCollect: "https://docs.simpleanalytics.com/what-we-collect",
    metrics: "https://docs.simpleanalytics.com/metrics",
};

const PrivacyPage = () => {
    return (
        <div className="relative container mx-auto mb-8">
            <section className="container flex flex-col gap-4 md:my-16">
                <h1 className="mb-4 text-center text-3xl font-semibold">Privacy</h1>
                <div className="mx-auto mt-8 max-w-prose space-y-6 text-base leading-relaxed">
                    <p>
                        At <i>arpg-timeline.com</i>, your privacy is important. This page outlines
                        how information is collected and used when you visit the site.
                    </p>
                    <p>
                        We do not use cookies for tracking, analytics, or advertising. Our hosting
                        provider (Vercel) may set a strictly necessary security cookie to protect
                        the website from abuse and automated traffic. Like most websites, the
                        hosting infrastructure may also temporarily process IP addresses in server
                        logs for security and operational purposes.
                    </p>
                    <p>
                        We use Simple Analytics to help us understand website usage. It provides
                        anonymous metrics only. Read more{" "}
                        <Link
                            className="underline hover:opacity-80"
                            href={links.gdpr}
                            rel="noopener noreferrer nofollow"
                            target="_blank"
                            data-sa-click="privacy-gdpr"
                        >
                            here
                        </Link>
                        .
                    </p>
                    <p>
                        This website also uses local storage to remember user preferences like theme
                        or filters. No personal data is stored or transmitted - it stays on your
                        device.
                    </p>
                    <p>
                        If you have any questions about our privacy practices, feel free to contact
                        me on{" "}
                        <Link
                            className="underline hover:opacity-80"
                            href={links.github}
                            rel="noopener nofollow noreferrer"
                            target="_blank"
                            data-sa-click="github"
                        >
                            GitHub
                        </Link>
                        .
                    </p>
                </div>
            </section>

            <section className="container flex flex-col gap-4 md:my-16">
                <h2 className="mb-4 text-center text-3xl font-semibold">
                    What We Do and Do Not Collect
                </h2>
                <div className="mx-auto mt-8 max-w-prose space-y-6 text-base leading-relaxed">
                    <p>
                        You can read a thorough report{" "}
                        <Link
                            className="underline hover:opacity-80"
                            href={links.whatWeCollect}
                            rel="noopener noreferrer nofollow"
                            target="_blank"
                            data-sa-click="privacy-what-we-collect"
                        >
                            here
                        </Link>{" "}
                        and{" "}
                        <Link
                            className="underline hover:opacity-80"
                            href={links.metrics}
                            rel="noopener noreferrer nofollow"
                            target="_blank"
                            data-sa-click="privacy-metrics"
                        >
                            here
                        </Link>
                        .
                    </p>
                    <p>
                        By default, we do <strong>not</strong> collect or store any data if a
                        visitor has <i>Do Not Track</i> enabled.
                    </p>
                    <p>Otherwise, we collect only the following anonymous metrics:</p>
                    <ul className="list-inside list-disc space-y-2">
                        <li>Whether visits are unique</li>
                        <li>
                            <strong>No</strong> tracking or advertising cookies
                        </li>
                        <li>
                            <strong>No</strong> IP addresses stored for analytics
                        </li>
                        <li>Timestamps of visits</li>
                        <li>Anonymized user agents</li>
                        <li>Country of visitor</li>
                        <li>Language of the visitor</li>
                        <li>Partial referrer information</li>
                        <li>Device screen dimensions</li>
                        <li>Page view duration</li>
                    </ul>
                </div>
            </section>

            <section
                id="discord-bot"
                className="container flex scroll-mt-8 flex-col gap-4 md:my-16"
            >
                <h2 className="mb-4 text-center text-3xl font-semibold">Discord Bot</h2>
                <div className="mx-auto mt-8 max-w-prose space-y-6 text-base leading-relaxed">
                    <p>
                        The aRPG Timeline Discord bot only stores what it needs to add season events
                        to your server. For each server it is added to, it keeps:
                    </p>
                    <ul className="list-inside list-disc space-y-2">
                        <li>The server ID</li>
                        <li>Whether the bot is turned on, and which games are selected</li>
                        <li>
                            The IDs of the events it created, so it can update or remove them later
                        </li>
                    </ul>
                    <p>
                        The bot does <strong>not</strong> store message content, member lists or
                        online status.
                    </p>
                    <p>
                        If you send feedback with the <code>/feedback</code> command, your message
                        is forwarded privately to the maintainer on Discord, together with your
                        Discord account details (such as username and account age) and the name, ID
                        and member count of the server you sent it from.
                    </p>
                    <p>
                        The bot also keeps short-lived technical logs that include server IDs and
                        errors. They are used only to fix problems and are not shared.
                    </p>
                    <p>
                        To have your server&apos;s stored data deleted, contact us on{" "}
                        <Link
                            className="underline hover:opacity-80"
                            href={process.env.NEXT_PUBLIC_DISCORD_URL || "#"}
                            rel="noopener noreferrer nofollow"
                            target="_blank"
                            data-sa-click="privacy-discord"
                        >
                            Discord
                        </Link>{" "}
                        or by{" "}
                        <Link
                            className="underline hover:opacity-80"
                            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                            rel="noopener noreferrer nofollow"
                            data-sa-click="privacy-email"
                        >
                            email
                        </Link>
                        . Discord itself also processes data under its own{" "}
                        <Link
                            className="underline hover:opacity-80"
                            href="https://discord.com/privacy"
                            rel="noopener noreferrer nofollow"
                            target="_blank"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPage;

export const revalidate = false;
