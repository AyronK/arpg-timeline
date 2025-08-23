import Link from "next/link";

export const Footer = () => (
    <footer className="mt-4">
        <div className="border-foreground bg-card flex flex-col gap-4 border-t px-4 py-4">
            <p className="text-muted-foreground mx-auto max-w-4xl text-center text-balance italic">
                This site is independently developed, primarily by a solo developer with occasional
                community contributions, and maintained/hosted through Patreon support. It is not
                affiliated with any game studio, publisher, or official entity in the gaming
                industry.
            </p>
            <div className="flex flex-col justify-evenly gap-6 md:flex-row">
                <div className="flex flex-row gap-1">
                    <Link
                        href="/assets/about.txt"
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                    >
                        Licenses
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        href="/faq"
                    >
                        FAQ
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold transition-opacity duration-200 hover:opacity-75"
                        href="/privacy"
                    >
                        Privacy & GDPR
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
                    >
                        AyronK @ GitHub
                    </Link>
                </div>
            </div>
        </div>
    </footer>
);
