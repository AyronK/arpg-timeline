import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms of Service - aRPG Timeline",
    description:
        "Terms of Service for arpg-timeline.com covering API usage, calendar subscriptions, embeddable widgets, the Discord bot, scraping policy, and source code license.",
};

const TermsPage = () => {
    return (
        <div className="relative container mx-auto mb-8">
            <section className="container flex flex-col gap-4 md:my-16">
                <h1 className="mb-4 text-center text-3xl font-semibold">Terms of Service</h1>
                <div className="mx-auto mt-8 max-w-prose space-y-10 text-base leading-relaxed">
                    <p className="text-muted-foreground text-sm">
                        Effective date: September 24, 2026
                    </p>
                    <p>
                        By using arpg-timeline.com (the &ldquo;Site&rdquo;), you agree to these
                        Terms of Service. If you disagree, please stop using the Site.
                    </p>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">1. What This Site Is</h3>
                        <p>
                            arpg-timeline.com is a community-maintained dashboard tracking seasons
                            and events for various action RPGs. The selection of tracked games is
                            subjective and curated by the maintainer, though community suggestions
                            are actively welcomed via Discord or Patreon. Data is manually curated
                            and may contain errors or be delayed due to human updates - no warranty
                            is given on its accuracy or completeness.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">2. No Affiliation</h3>
                        <p>
                            This Site is an independent fan project. It is not affiliated with,
                            endorsed by, or associated with any game publisher, including but not
                            limited to Grinding Gear Games, Blizzard Entertainment, or Eleventh Hour
                            Games. All game names, trademarks, and related assets are the property
                            of their respective owners.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">
                            3. Game Imagery &amp; Editorial Use
                        </h3>
                        <p>
                            Screenshots, artwork, promotional material, and press-kit assets shown
                            on the Site remain the copyright of their respective owners. They are
                            reproduced here for editorial and illustrative purposes accompanying
                            news and reference content, under the fan-content and press-asset
                            policies of the respective publishers where such policies exist. Where a
                            source is known it is credited beneath the image. No claim of ownership
                            is made, and their presence does not imply endorsement.
                        </p>
                        <p>
                            If you are a rights holder and want an image removed or credited
                            differently, contact us at{" "}
                            <Link
                                className="text-primary underline underline-offset-2 transition-all hover:brightness-125"
                                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                            >
                                {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                            </Link>{" "}
                            and we will act on it promptly.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">4. Calendar Subscriptions</h3>
                        <p>
                            Calendar feeds are provided for personal, non-commercial use only.
                            Redistribution of calendar feeds or their contents is not permitted.
                            Feeds are provided as-is with no guarantee of accuracy or availability.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">5. Embeddable Widgets</h3>
                        <p>
                            You may embed the provided widgets on personal or community websites.
                            You may not modify the widget source, obscure or remove the
                            arpg-timeline.com logo or branding, use them in a misleading context, or
                            embed them in commercial products without prior written permission.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">6. Scraping &amp; Crawling</h3>
                        <p>
                            Automated scraping or crawling of the Site is not permitted. If you need
                            programmatic access to data, use the API (subject to Section 8).
                            Excessive automated requests may be blocked without notice.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">7. Source Code &amp; License</h3>
                        <p>
                            The source code is publicly available on GitHub under the{" "}
                            <Link
                                className="underline hover:opacity-80"
                                href="https://www.elastic.co/licensing/elastic-license"
                                rel="noopener noreferrer nofollow"
                                target="_blank"
                            >
                                Elastic License 2.0
                            </Link>
                            . You may read, learn from, and contribute to it, but you may not host
                            it as a competing service or managed product. See the{" "}
                            <Link className="underline hover:opacity-80" href="/transparency">
                                Transparency
                            </Link>{" "}
                            page for a plain-language explanation of what is and isn&apos;t allowed.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">8. API</h3>
                        <p>
                            Access to the API is invite-only or available through an active Patreon
                            membership. By using the API you agree to:
                        </p>
                        <ul className="list-inside list-disc space-y-2">
                            <li>
                                Keep your credentials (client ID, client secret, tokens)
                                confidential and not share them
                            </li>
                            <li>
                                Use the API only for personal or non-commercial purposes unless
                                explicitly agreed otherwise in writing
                            </li>
                            <li>
                                Not resell, republish, or redistribute data obtained from the API
                            </li>
                            <li>Respect any rate limits in place</li>
                        </ul>
                        <p>
                            Commercial use of the API is not permitted by default. If you have a
                            commercial use case, contact us to discuss it individually.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">9. Discord Bot</h3>
                        <p>
                            The aRPG Timeline Discord bot (the &ldquo;Bot&rdquo;) adds upcoming aRPG
                            seasons to your server as Discord scheduled events. By adding the Bot to
                            a server or using its commands, you agree to these terms. You also
                            remain bound by{" "}
                            <Link
                                className="underline hover:opacity-80"
                                href="https://discord.com/terms"
                                rel="noopener noreferrer nofollow"
                                target="_blank"
                            >
                                Discord&apos;s Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                className="underline hover:opacity-80"
                                href="https://discord.com/guidelines"
                                rel="noopener noreferrer nofollow"
                                target="_blank"
                            >
                                Community Guidelines
                            </Link>
                            .
                        </p>
                        <ul className="list-inside list-disc space-y-2">
                            <li>
                                <strong>Server owners are in charge.</strong> Whoever adds the Bot
                                is responsible for its setup and for the events it creates in their
                                server. Events can be edited or deleted like any other Discord
                                event.
                            </li>
                            <li>
                                <strong>Fair use.</strong> Don&apos;t spam commands, try to disrupt
                                or overload the Bot, or use it to break Discord&apos;s rules. We may
                                block servers or users that abuse it.
                            </li>
                            <li>
                                <strong>Your data.</strong> The Bot stores only what it needs to
                                work. See the{" "}
                                <Link
                                    className="underline hover:opacity-80"
                                    href="/privacy#discord-bot"
                                >
                                    Privacy Policy
                                </Link>{" "}
                                for exactly what is kept and how to have it deleted.
                            </li>
                            <li>
                                <strong>Removing the Bot.</strong> You can remove the Bot from your
                                server at any time.
                            </li>
                            <li>
                                <strong>No guarantees.</strong> The Bot is free and provided as-is.
                                Season dates come from aRPG Timeline and may be wrong, change or
                                arrive late. The Bot may be changed, paused or shut down at any
                                time, and we&apos;re not responsible for missed launches or for the
                                events it creates in your server.
                            </li>
                            <li>
                                <strong>Source code.</strong> The Bot&apos;s code is open source
                                under the MIT License. That license covers the code only. The hosted
                                Bot and the aRPG Timeline name and branding stay under these terms.
                            </li>
                            <li>
                                <strong>Third parties.</strong> The Bot&apos;s listings on Discord
                                and top.gg are run by those platforms under their own terms.
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">10. Privacy</h3>
                        <p>
                            This Site respects your privacy. No tracking cookies are used. See the{" "}
                            <Link className="underline hover:opacity-80" href="/privacy">
                                Privacy Policy
                            </Link>{" "}
                            for full details.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">11. Limitation of Liability</h3>
                        <p>
                            This is a hobby project run by a single developer. It is provided as-is
                            and we cannot be held responsible if something goes wrong - for example,
                            if data is wrong, the site is unavailable, or you miss a league start
                            because of an error here.
                        </p>
                        <p className="text-muted-foreground text-sm">
                            If you are based in the EU, your statutory consumer rights still apply
                            and cannot be waived by these terms. This clause does not limit
                            liability for intentional misconduct or gross negligence.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">12. Changes</h3>
                        <p>
                            These terms may be updated at any time. The effective date at the top of
                            this page will reflect the date of the latest revision. Continued use of
                            the Site after changes constitutes acceptance.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsPage;

export const revalidate = false;
