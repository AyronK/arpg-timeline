import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Transparency - aRPG Timeline",
    description:
        "Why the source code is public, what license it uses, and what you can and cannot do with it.",
};

const TransparencyPage = () => {
    return (
        <div className="relative container mx-auto mb-8">
            <section className="container flex flex-col gap-4 md:my-16">
                <h2 className="mb-4 text-center text-3xl font-semibold">Transparency</h2>
                <div className="mx-auto mt-8 max-w-prose space-y-10 text-base leading-relaxed">
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">Why is this code public?</h3>
                        <p>This repository is public so you can:</p>
                        <ul className="list-inside list-disc space-y-2">
                            <li>See exactly what the site does and how it works</li>
                            <li>
                                Verify privacy claims - the site uses{" "}
                                <Link
                                    className="underline hover:opacity-80"
                                    href="https://simpleanalytics.com"
                                    rel="noopener noreferrer nofollow"
                                    target="_blank"
                                >
                                    Simple Analytics
                                </Link>
                                , no personal data collected
                            </li>
                            <li>Learn from the implementation and contribute improvements</li>
                            <li>
                                Trust that there are no hidden trackers, data harvesting, or shady
                                behavior
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">Why not fully open source?</h3>
                        <p>
                            This is not open source in the{" "}
                            <Link
                                className="underline hover:opacity-80"
                                href="https://opensource.org/definition"
                                rel="noopener noreferrer nofollow"
                                target="_blank"
                            >
                                OSI sense
                            </Link>
                            . The source is visible and contributions are welcome, but the license (
                            <Link
                                className="underline hover:opacity-80"
                                href="https://www.elastic.co/licensing/elastic-license"
                                rel="noopener noreferrer nofollow"
                                target="_blank"
                            >
                                Elastic License 2.0
                            </Link>
                            ) prohibits hosting this as a competing service or managed product.
                        </p>
                        <p>
                            Years of work went into the curation, content pipeline, community, and
                            SEO that make this site useful. Making the code public is about
                            transparency and collaboration - not about making it easy for
                            competitors to build a business on top of that work.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">What can you do with the code?</h3>
                        <ul className="list-inside list-disc space-y-2">
                            <li>Read it, learn from it, fork it for personal use</li>
                            <li>
                                Contribute bug fixes, features, and improvements via pull requests
                            </li>
                            <li>Run it locally for development or experimentation</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">
                            What can you <em>not</em> do?
                        </h3>
                        <ul className="list-inside list-disc space-y-2">
                            <li>
                                Host a public-facing version of this site as a competing service
                            </li>
                            <li>Offer it as a hosted or managed product to others</li>
                        </ul>
                        <p>
                            If you have a use case that doesn&apos;t fit neatly into these
                            categories, reach out.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TransparencyPage;

export const revalidate = false;
