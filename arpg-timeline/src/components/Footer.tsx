import { Clock, Code2, Heart, ShieldOff } from "lucide-react";
import Link from "next/link";

import { FooterPartnerPromosLink } from "@/components/FooterPartnerPromosLink";

export const Footer = () => (
    <footer className="mt-4">
        <div className="border-foreground bg-card flex flex-col gap-4 border-t px-4 py-4">
            <div className="text-muted-foreground border-foreground/40 container mx-auto grid gap-4 border-b pb-4 text-sm italic md:grid-cols-4">
                <div className="flex items-start gap-2">
                    <Code2 className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                    <p className="text-balance">
                        Independently developed by a solo developer with occasional community
                        contributions.
                    </p>
                </div>
                <div className="flex items-start gap-2">
                    <ShieldOff className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                    <p className="text-balance">
                        Not affiliated with any game studio, publisher, or official entity in the
                        gaming industry.
                    </p>
                </div>
                <div className="flex items-start gap-2">
                    <Heart className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                    <p className="text-balance">
                        Maintained through Patreon support and affiliate deals - no intrusive ads,
                        privacy-first.
                    </p>
                </div>
                <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                    <p className="text-balance">
                        Data may not always be accurate; updates can be delayed up to 48 hours.
                    </p>
                </div>
            </div>
            <div className="flex flex-col justify-evenly gap-6 md:flex-row">
                <div className="flex flex-row gap-1">
                    <FooterPartnerPromosLink />
                </div>
                <div className="flex flex-row gap-1">
                    <Link
                        href="/assets/about.txt"
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        data-sa-click="licenses"
                    >
                        Licenses
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        href="/community-launchers"
                        data-sa-click="community-launchers"
                    >
                        Community launchers
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        href="/support"
                        data-sa-click="support"
                    >
                        Support us
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        href="/faq"
                        data-sa-click="faq"
                    >
                        FAQ
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        href="/calendar"
                        data-sa-click="calendar"
                    >
                        Calendar
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        href="/privacy"
                        data-sa-click="privacy"
                    >
                        Privacy & GDPR
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        href="/docs/api"
                        data-sa-click="api-docs"
                    >
                        API Docs
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        href={process.env.NEXT_PUBLIC_DISCORD_URL}
                        rel="noopener noreferrer"
                        data-sa-click="discord"
                    >
                        Discord
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                        data-sa-click="contact"
                    >
                        Contact
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    &copy; <span id="currentYear">{new Date().getFullYear()}</span>-
                    <Link
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        href={process.env.NEXT_PUBLIC_GITHUB_URL}
                        rel="external nofollow noreferrer"
                        target="_blank"
                        aria-label="Author's Github Profile - AyronK"
                        data-sa-click="github"
                    >
                        AyronK @ GitHub
                    </Link>
                </div>
            </div>
        </div>
    </footer>
);
