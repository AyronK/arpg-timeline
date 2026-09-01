import { Code2, Newspaper, Telescope } from "lucide-react";
import { Metadata } from "next";

import { AI_DISCLOSURE_MAX, AI_DISCLOSURE_META } from "@/lib/articles/aiDisclosure";
import type { AiDisclosure } from "@/lib/cms/queries/articleQuery";

export const metadata: Metadata = {
    title: "AI Usage - aRPG Timeline",
    description:
        "How and where AI is used on aRPG Timeline: the per-article disclosure scale, plus development and research.",
    alternates: { canonical: "/ai-usage" },
};

const ARTICLE_LEVELS: {
    value: AiDisclosure;
    detail: string;
}[] = [
    {
        value: "none",
        detail: "No AI, at any point. Every word and every bit of formatting is done by hand.",
    },
    {
        value: "styling",
        detail: "A person does all the research and writing. AI only tidies up the formatting - headings, lists, tables, Markdown - without touching the meaning.",
    },
    {
        value: "assisted",
        detail: "Everything from level 1, plus AI for digging up background, summarising sources, or sketching an outline. The writing itself is still done by a person.",
    },
    {
        value: "redacted",
        detail: "Everything from level 2, plus a first draft written by AI. A person then does the final pass - edits it, checks the facts, and stands behind what goes out.",
    },
    {
        value: "fully-generated",
        detail: "Mostly the AI's work, with just a light once-over before publishing. Rare, and always labelled.",
    },
];

const AiUsagePage = () => {
    return (
        <div className="relative container mx-auto mb-8">
            <section className="container flex flex-col gap-4 md:my-16">
                <h1 className="mb-4 text-center text-3xl font-semibold">AI Usage</h1>
                <div className="mx-auto mt-8 max-w-prose space-y-10 text-base leading-relaxed">
                    <p>
                        Here&apos;s where AI is used on aRPG Timeline, and where it isn&apos;t. The
                        point is simple: you should always know what you&apos;re reading and how it
                        was made.
                    </p>

                    <div className="border-foreground/20 space-y-3 border-t pt-10">
                        <h3 className="flex items-center gap-2 text-xl font-semibold">
                            <Code2 className="text-primary h-5 w-5 shrink-0" aria-hidden />
                            AI usage in development
                        </h3>
                        <p>
                            aRPG Timeline was built by hand from day one, and it stayed that way for
                            years. Then AI coding tools got good enough to actually help - and for a{" "}
                            <strong>solo developer</strong>, that means getting from an idea to a
                            working feature a lot faster.
                        </p>
                        <p>These days AI helps me with:</p>
                        <ul className="list-inside list-disc space-y-2">
                            <li>mockups and quick prototypes</li>
                            <li>scaffolding new features</li>
                            <li>refactoring old code</li>
                            <li>weighing up different ways to build something</li>
                        </ul>
                        <p>
                            It doesn&apos;t get the final say, though. Everything it writes gets
                            read, understood, and reworked by hand, and{" "}
                            <strong>held to the same standard</strong> as the rest of the code
                            before it ships.
                        </p>
                        <p>
                            I&apos;ve spent{" "}
                            <strong>years as a software developer and a tech lead</strong> building
                            full-stack software, and I hold this project to that same bar - with
                            privacy and a clean user experience coming first. AI is a tool for
                            speeding up the safe parts. It&apos;s not a stand-in for the work, and
                            it&apos;s never an excuse to ship AI slop nobody checked.
                        </p>
                    </div>

                    <div className="border-foreground/20 space-y-3 border-t pt-10">
                        <h3 className="flex items-center gap-2 text-xl font-semibold">
                            <Telescope className="text-primary h-5 w-5 shrink-0" aria-hidden />
                            AI usage in research
                        </h3>
                        <p>
                            Keeping track of dozens of games means going through a constant flood of
                            news, dev posts, forum threads, and community threads. AI helps me keep
                            up.
                        </p>
                        <p>It&apos;s good for:</p>
                        <ul className="list-inside list-disc space-y-2">
                            <li>getting through a lot of sources fast</li>
                            <li>spotting the updates that actually matter for games and seasons</li>
                            <li>squeezing long announcements down to the key points</li>
                        </ul>
                        <p>
                            Where it falls short is the details. It gets facts, names, and -
                            especially - dates wrong all the time, so I treat anything it gives me
                            as a tip to follow up, not as a source.
                        </p>
                        <p>
                            <strong>
                                Every date and every detail is verified against the official source
                                by hand
                            </strong>{" "}
                            before it goes live.
                        </p>
                    </div>

                    <div
                        id="articles"
                        className="border-foreground/20 scroll-mt-24 space-y-4 border-t pt-10"
                    >
                        <h3 className="flex items-center gap-2 text-xl font-semibold">
                            <Newspaper className="text-primary h-5 w-5 shrink-0" aria-hidden />
                            AI usage in articles
                        </h3>
                        <p>
                            Every article has a small badge in its byline showing how much AI went
                            into it, on a scale from <strong>0</strong> (none) to{" "}
                            <strong>{AI_DISCLOSURE_MAX}</strong> (fully generated). The levels stack
                            - each one includes everything before it and adds a bit more:
                        </p>
                        <ol className="space-y-4">
                            {ARTICLE_LEVELS.map(({ value, detail }) => {
                                const meta = AI_DISCLOSURE_META[value];
                                return (
                                    <li key={value} className="space-y-1">
                                        <p className="font-semibold">
                                            {meta.degree} - {meta.label}
                                        </p>
                                        <p className="text-muted-foreground">{detail}</p>
                                    </li>
                                );
                            })}
                        </ol>
                        <p>
                            The author picks the level when publishing, and it covers the whole
                            article. If it&apos;s a close call, the higher level wins.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AiUsagePage;

export const revalidate = false;
