"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

import { Button } from "@/ui/Button";

export const HtmlEmbedManual = ({ game }: { game: string }) => {
    const [copied, setCopied] = useState(false);

    const embedCode = `<iframe
  style="background: #17171c"
  src="https://www.arpg-timeline.com/embed/season-widget/${game}"
  width="600"
  height="300"
  title="aRPG Timeline Season Widget"
></iframe>`;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <article className="mx-auto flex max-w-4xl flex-col gap-6 p-2 md:p-6">
            <header className="space-y-2">
                <h1 className="font-heading text-foreground text-3xl font-bold">
                    Embed aRPG-Timeline on Your Website
                </h1>
                <p className="text-muted-foreground text-lg">
                    Add the aRPG Timeline season widget to your website with a simple HTML embed
                    code.
                </p>
            </header>

            <section className="space-y-4">
                <h2 className="font-heading text-xl font-semibold">HTML Embed Code</h2>
                <p className="text-muted-foreground">
                    Copy and paste this HTML code into your website where you want the widget to
                    appear:
                </p>

                <div className="relative">
                    <div className="bg-card overflow-x-auto rounded-lg border p-4">
                        <pre className="text-sm">
                            <code className="language-html text-foreground font-mono whitespace-pre">
                                {embedCode}
                            </code>
                        </pre>
                    </div>
                    <Button
                        className="absolute top-3 right-3"
                        variant={"default"}
                        onClick={handleCopy}
                        aria-label={copied ? "Copied!" : "Copy embed code"}
                        data-sa-click={`${game}-copy-embed-code`}
                    >
                        {copied ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Copy</span>
                            </>
                        )}
                    </Button>
                </div>
            </section>

            <section className="space-y-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <h3 className="font-semibold text-yellow-800">⚠️ Important Notice</h3>
                <p className="text-sm text-yellow-700">
                    When you embed the widget, you must not hide or overlay any elements such as the
                    aRPG Timeline logo or block mouse click events.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="font-heading text-xl font-semibold">Customization Options</h2>
                <div className="grid gap-3 text-sm">
                    <div className="flex gap-3">
                        <code className="bg-muted text-foreground mb-auto min-w-[64px] rounded px-2 py-1 text-center font-mono">
                            width
                        </code>
                        <span className="text-muted-foreground">
                            Adjust the width (recommended: 350px minimum)
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <code className="bg-muted text-foreground mb-auto min-w-[64px] rounded px-2 py-1 text-center font-mono">
                            height
                        </code>
                        <span className="text-muted-foreground">
                            Adjust the height (recommended: 300px minimum)
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <code className="bg-muted text-foreground mb-auto min-w-[64px] rounded px-2 py-1 text-center font-mono">
                            style
                        </code>
                        <span className="text-muted-foreground">
                            The dark background matches the widget theme
                        </span>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <h2 className="font-heading text-xl font-semibold">
                        Live Preview (transparent)
                    </h2>
                    <a
                        href={`https://www.arpg-timeline.com/embed/season-widget/${game}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
                        aria-label="Open widget in new tab"
                        data-sa-click={`${game}-open-widget-in-new-tab`}
                    >
                        <ExternalLink className="h-3 w-3" />
                        Open in new tab
                    </a>
                </div>
                <p className="text-muted-foreground hidden md:flex">
                    This is how the widget will appear on your website:
                </p>

                <div className="hidden justify-center md:flex">
                    <div className="border-muted-foreground bg-card overflow-hidden rounded-lg border shadow-sm">
                        <div className="w-full overflow-auto">
                            <iframe
                                style={{ background: "#17171c" }}
                                src={`https://www.arpg-timeline.com/embed/season-widget/${game}`}
                                width="600"
                                height="300"
                                title="aRPG Timeline Season Widget Preview"
                                className="block max-w-full"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-card space-y-2 rounded-lg p-4">
                <h3 className="text-foreground font-semibold">💡 Tips</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• The widget is responsive and will adapt to smaller screens</li>
                    <li>• For optimal display, ensure a minimum width of 350px</li>
                    <li>• The widget automatically updates with the latest season information</li>
                    <li>• No JavaScript required - it&apos;s a simple HTML embed</li>
                </ul>
            </section>
        </article>
    );
};
