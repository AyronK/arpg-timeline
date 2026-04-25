import { BookOpen, Clock, Code2, Heart, Info, Scale, ShieldOff, Users } from "lucide-react";
import Link from "next/link";

import { FooterPartnerPromosLink } from "@/components/FooterPartnerPromosLink";

export const Footer = () => (
    <footer className="mt-10 md:mt-36">
        <div className="border-foreground bg-card flex flex-col gap-4 border-t px-4 py-4">
            <div className="container mx-auto grid gap-6 text-sm md:grid-cols-4">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 opacity-50" />
                        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            Development
                        </span>
                    </div>
                    <p className="text-muted-foreground text-xs text-balance italic">
                        Independently developed by a solo developer with occasional community
                        contributions.
                    </p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Info className="h-5 w-5 opacity-50" />
                            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                About
                            </span>
                        </div>
                        <FooterPartnerPromosLink />
                        <Link
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            href="/support"
                            data-sa-click="support"
                        >
                            Support us
                        </Link>
                        <Link
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            href="/support#supporters"
                            data-sa-click="supporters-credits"
                        >
                            Credits & supporters
                        </Link>
                        <Link
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            href="/community-launchers"
                            data-sa-click="community-launchers"
                        >
                            Community launchers
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 opacity-50" />
                        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            Data Accuracy
                        </span>
                    </div>
                    <p className="text-muted-foreground text-xs text-balance italic">
                        Data may not always be accurate; updates can be delayed up to 48 hours.
                    </p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 opacity-50" />
                            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                Resources
                            </span>
                        </div>
                        <Link
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            href="/faq"
                            data-sa-click="faq"
                        >
                            FAQ
                        </Link>
                        <Link
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            href="/calendar"
                            data-sa-click="calendar"
                        >
                            Calendar
                        </Link>
                        <Link
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            href="/docs/api"
                            rel="noopener noreferrer nofollow"
                            data-sa-click="api-docs"
                        >
                            API Docs
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 opacity-50" />
                        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            Sustainability
                        </span>
                    </div>
                    <p className="text-muted-foreground text-xs text-balance italic">
                        Maintained through Patreon support and affiliate deals - no intrusive ads,
                        privacy-first.
                    </p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 opacity-50" />
                            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                Community
                            </span>
                        </div>
                        <Link
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            href={process.env.NEXT_PUBLIC_DISCORD_URL}
                            rel="noopener noreferrer nofollow"
                            data-sa-click="discord"
                        >
                            Discord
                        </Link>
                        <Link
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                            rel="noopener noreferrer nofollow"
                            data-sa-click="contact"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <ShieldOff className="h-5 w-5 opacity-50" />
                        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            Independence
                        </span>
                    </div>
                    <p className="text-muted-foreground text-xs text-balance italic">
                        Not affiliated with any game studio, publisher, or official entity in the
                        gaming industry.
                    </p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Scale className="h-5 w-5 opacity-50" />
                            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                Legal
                            </span>
                        </div>
                        <Link
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            href="/privacy"
                            data-sa-click="privacy"
                        >
                            Privacy & GDPR
                        </Link>
                        <Link
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            href="/terms"
                            data-sa-click="terms"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            href="/transparency"
                            data-sa-click="transparency"
                        >
                            Transparency
                        </Link>
                        <Link
                            href="/assets/about.txt"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                            data-sa-click="licenses"
                        >
                            Licenses
                        </Link>
                        <span className="text-muted-foreground">
                            &copy; {new Date().getFullYear()}{" "}
                            <Link
                                className="hover:text-primary font-semibold transition-all duration-200 hover:translate-x-1"
                                href={process.env.NEXT_PUBLIC_GITHUB_URL}
                                rel="noopener noreferrer nofollow"
                                target="_blank"
                                aria-label="Author's Github Profile - AyronK"
                                data-sa-click="github"
                            >
                                AyronK @ GitHub
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);
