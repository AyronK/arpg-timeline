import Link from "next/link";

import { Button } from "@/ui/Button";

const links = {
    gdpr: "https://docs.simpleanalytics.com/gdpr",
    github: `${process.env.GITHUB_URL!}/${process.env.GITHUB_REPO!}/issues`,
    whatWeCollect: "https://docs.simpleanalytics.com/what-we-collect",
    metrics: "https://docs.simpleanalytics.com/metrics",
};

const PrivacyPage = () => {
    return (
        <div className="container mx-auto my-12 max-w-prose space-y-16 px-4">
            <section>
                <h2 className="mb-4 text-center text-3xl font-semibold">Privacy</h2>
                <div className="space-y-6 text-base leading-relaxed">
                    <p>
                        At <i>arpg-timeline.com</i>, your privacy is important. This page outlines
                        how information is collected and used when you visit the site.
                    </p>
                    <p>We do not use cookies or process any personal data.</p>
                    <p>
                        We use Simple Analytics to help us understand website usage. It provides
                        anonymous metrics only. Read more{" "}
                        <Button className="px-0 text-base" variant="link" asChild>
                            <Link
                                className="underline"
                                href={links.gdpr}
                                rel="noopener nofollow noreferrer"
                                target="_blank"
                            >
                                here
                            </Link>
                        </Button>
                        .
                    </p>
                    <p>
                        This website also uses local storage to remember user preferences like theme
                        or filters. No personal data is stored or transmitted — it stays on your
                        device.
                    </p>
                    <p>
                        If you have any questions about our privacy practices, feel free to contact
                        me on{" "}
                        <Button className="px-0 text-base" variant="link" asChild>
                            <Link
                                className="underline"
                                href={links.github}
                                rel="noopener nofollow noreferrer"
                                target="_blank"
                            >
                                GitHub
                            </Link>
                        </Button>
                        .
                    </p>
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-center text-3xl font-semibold">
                    What We Do and Do Not Collect
                </h2>
                <div className="space-y-6 text-base leading-relaxed">
                    <p>
                        You can read a thorough report{" "}
                        <Button className="px-0 text-base" variant="link" asChild>
                            <Link
                                className="underline"
                                href={links.whatWeCollect}
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                here
                            </Link>
                        </Button>{" "}
                        and{" "}
                        <Button className="px-0 text-base" variant="link" asChild>
                            <Link
                                className="underline"
                                href={links.metrics}
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                here
                            </Link>
                        </Button>
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
                            <strong>No</strong> cookies or similar technologies
                        </li>
                        <li>
                            <strong>No</strong> IP addresses collected or stored
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
        </div>
    );
};

export default PrivacyPage;

export const revalidate = false;
