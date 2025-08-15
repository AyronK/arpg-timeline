import Link from "next/link";

export type FooterProps = {
    discordUrl: string;
    githubUrl: string;
    contactEmail: string;
};

export const Footer = ({ discordUrl, githubUrl, contactEmail }: FooterProps) => (
    <footer className="mt-4">
        <div className="border-foreground bg-card flex flex-col gap-4 border-t px-4 py-4">
            <p className="mx-auto max-w-4xl text-center text-balance italic">
                This site is independently developed, primarily by a solo developer with occasional
                community contributions, and maintained/hosted through Patreon support. It is not
                affiliated with any game studio, publisher, or official entity in the gaming
                industry.
            </p>
            <div className="flex flex-col justify-evenly gap-6 md:flex-row">
                <div className="flex flex-row gap-1">
                    <Link
                        title="RSS Feed"
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="font-semibold hover:opacity-75"
                        href="/assets/about.txt"
                    >
                        Licences
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link className="font-semibold hover:opacity-75" href="/privacy" rel="self">
                        Privacy & GDPR
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold hover:opacity-75"
                        href={discordUrl}
                        rel="noopener noreferrer"
                        data-sa-click="discord"
                    >
                        Discord
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    <Link
                        className="font-semibold hover:opacity-75"
                        href={`mailto:${contactEmail}`}
                        rel="noopener noreferrer"
                    >
                        Contact
                    </Link>
                </div>

                <div className="flex flex-row gap-1">
                    &copy; <span id="currentYear">{new Date().getFullYear()}</span>-
                    <Link
                        className="font-semibold hover:opacity-75"
                        href={githubUrl}
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
