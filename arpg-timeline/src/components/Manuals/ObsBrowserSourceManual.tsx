"use client";

import { Check, Copy, ExternalLink, Monitor, Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "@/ui/Button";

export const ObsBrowserSourceManual = ({ game }: { game: string }) => {
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [copiedCss, setCopiedCss] = useState(false);

    const widgetUrl = `https://www.arpg-timeline.com/embed/season-widget/${game}`;
    const customCss = `body { 
  margin: 0; 
  background-color: rgba(0,0,0,0); 
}`;

    const handleCopyUrl = async () => {
        await navigator.clipboard.writeText(widgetUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    const handleCopyCss = async () => {
        await navigator.clipboard.writeText(customCss);
        setCopiedCss(true);
        setTimeout(() => setCopiedCss(false), 2000);
    };

    return (
        <article className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
            <header className="space-y-2">
                <h1 className="font-heading text-foreground text-3xl font-bold">
                    Use aRPG-Timeline in OBS Studio
                </h1>
                <p className="text-muted-foreground text-lg">
                    Add the aRPG Timeline season widget to your stream using OBS Browser Source.
                </p>
            </header>

            <section className="space-y-4">
                <h2 className="font-heading flex items-center gap-2 text-xl font-semibold">
                    <Settings className="h-5 w-5" />
                    Step-by-Step Setup
                </h2>

                <div className="space-y-6">
                    <div className="bg-card space-y-3 rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">
                                1
                            </div>
                            <h3 className="font-semibold">Add Browser Source</h3>
                        </div>
                        <p className="text-muted-foreground ml-8 text-sm">
                            In OBS Studio, right-click in the Sources box and select{" "}
                            <strong>Add → Browser</strong>. Give it a descriptive name like
                            &quot;aRPG Timeline Widget&quot;.
                        </p>
                    </div>

                    <div className="bg-card space-y-3 rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">
                                2
                            </div>
                            <h3 className="font-semibold">Configure URL</h3>
                        </div>
                        <p className="text-muted-foreground mb-3 ml-8 text-sm">
                            Copy this URL and paste it into the <strong>URL</strong> field:
                        </p>
                        <div className="relative ml-8">
                            <div className="bg-muted overflow-x-auto rounded border p-3">
                                <code className="text-foreground overflow-auto font-mono text-sm whitespace-nowrap">
                                    {widgetUrl}
                                </code>
                            </div>
                            <Button
                                className="absolute top-2 right-2"
                                size="sm"
                                variant={"default"}
                                onClick={handleCopyUrl}
                                aria-label={copiedUrl ? "Copied!" : "Copy URL"}
                            >
                                {copiedUrl ? (
                                    <>
                                        <Check className="mr-1 h-3 w-3" />
                                        <span className="text-xs">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-1 h-3 w-3" />
                                        <span className="text-xs">Copy</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="bg-card space-y-3 rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">
                                3
                            </div>
                            <h3 className="font-semibold">Set Dimensions</h3>
                        </div>
                        <div className="ml-8 space-y-2">
                            <p className="text-muted-foreground text-sm">
                                Configure these settings in the Browser Source properties:
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Width:</span>
                                    <code className="bg-muted rounded px-2 font-mono">600</code>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Height:</span>
                                    <code className="bg-muted rounded px-2 font-mono">300</code>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card space-y-3 rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">
                                4
                            </div>
                            <h3 className="font-semibold">Add Custom CSS (Optional)</h3>
                        </div>
                        <p className="text-muted-foreground mb-3 ml-8 text-sm">
                            For transparent background, add this CSS in the{" "}
                            <strong>Custom CSS</strong> field:
                        </p>
                        <div className="relative ml-8">
                            <div className="bg-muted overflow-x-auto rounded border p-3">
                                <pre className="text-sm">
                                    <code className="text-foreground font-mono whitespace-pre">
                                        {customCss}
                                    </code>
                                </pre>
                            </div>
                            <Button
                                className="absolute top-2 right-2"
                                size="sm"
                                variant={"default"}
                                onClick={handleCopyCss}
                                aria-label={copiedCss ? "Copied!" : "Copy CSS"}
                            >
                                {copiedCss ? (
                                    <>
                                        <Check className="mr-1 h-3 w-3" />
                                        <span className="text-xs">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-1 h-3 w-3" />
                                        <span className="text-xs">Copy</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="bg-card space-y-3 rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">
                                5
                            </div>
                            <h3 className="font-semibold">Additional Settings</h3>
                        </div>
                        <div className="ml-8 space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Shutdown source when not visible:
                                </span>
                                <span className="text-foreground">✓ Enabled (recommended)</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Refresh browser when scene becomes active:
                                </span>
                                <span className="text-foreground">✓ Enabled (recommended)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <h3 className="font-semibold text-yellow-800">⚠️ Important Notice</h3>
                <p className="text-sm text-yellow-700">
                    When using the widget in OBS, you must not hide or overlay any elements such as
                    the aRPG Timeline logo.
                </p>
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <h2 className="font-heading text-xl font-semibold">Stream Preview</h2>
                    <a
                        href={widgetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
                        aria-label="Open widget in new tab"
                    >
                        <ExternalLink className="h-3 w-3" />
                        Test in browser
                    </a>
                </div>
                <p className="text-muted-foreground hidden md:flex">
                    This is how the widget will appear overlaid on your stream:
                </p>

                <div className="hidden justify-center md:flex">
                    <div className="relative w-full max-w-4xl overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-900 shadow-lg">
                        {/* Mock stream background - responsive aspect ratio */}
                        <div className="relative aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                            {/* Mock game content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="space-y-2 text-center md:space-y-4">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-600/50 bg-gray-800/50 md:h-32 md:w-32 md:border-4">
                                        <Monitor className="h-8 w-8 text-gray-400 md:h-16 md:w-16" />
                                    </div>
                                </div>
                            </div>

                            {/* Mock chat overlay (left side) */}
                            <div className="absolute top-2 left-2 w-48 rounded-lg bg-black/70 p-2 backdrop-blur-sm md:top-4 md:left-4 md:w-64 md:p-3">
                                <div className="mb-1 text-xs font-semibold text-white md:mb-2 md:text-sm">
                                    Chat
                                </div>
                                <div className="space-y-1 text-xs">
                                    <div className="text-blue-400">viewer1: Nice build!</div>
                                    <div className="text-green-400">
                                        viewer2: What season is this?
                                    </div>
                                    <div className="text-purple-400">viewer3: Love the overlay</div>
                                </div>
                            </div>

                            {/* Mock stream info (bottom) */}
                            <div className="absolute right-2 bottom-0 left-2 flex items-end justify-between md:right-4 md:bottom-4 md:left-4">
                                <div className="rounded-lg bg-black/70 px-2 py-1 backdrop-blur-sm md:px-3 md:py-2">
                                    <div className="text-xs font-semibold text-white md:text-sm">
                                        StreamerName
                                    </div>
                                    <div className="text-xs text-gray-300">1,234 viewers</div>
                                </div>

                                <div className="absolute -top-8 right-0 rounded-full bg-green-500 px-1 px-2 py-1 text-xs text-white shadow">
                                    Widget
                                </div>

                                {/* Widget positioned in bottom right */}
                                <div className="relative mt-auto">
                                    <div
                                        style={{
                                            width: 300,
                                            height: 150,
                                        }}
                                    >
                                        <iframe
                                            style={{
                                                background: "transparent",
                                                width: 600,
                                                height: 300,
                                            }}
                                            src={widgetUrl}
                                            title="aRPG Timeline Widget OBS Preview"
                                            className="block w-full origin-top-left scale-50"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stream status indicator */}
                            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white md:top-4 md:right-4 md:gap-2 md:px-3 md:text-sm">
                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white md:h-2 md:w-2"></div>
                                LIVE
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-card space-y-2 rounded-lg p-4">
                <h3 className="text-foreground font-semibold">💡 Tips</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• Position the widget in a corner or overlay area of your stream layout</li>
                    <li>• The widget updates automatically - no need to refresh manually</li>
                    <li>• Test the widget in a separate scene before going live</li>
                    <li>
                        • Consider scaling the widget if you need a different size in your layout
                    </li>
                </ul>
            </section>

            <section className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="flex items-center gap-2 font-semibold text-blue-800">
                    <ExternalLink className="h-4 w-4" />
                    Need Help?
                </h3>
                <p className="text-sm text-blue-700">
                    For more information about Browser Sources in OBS, check out the{" "}
                    <a
                        href="https://obsproject.com/kb/browser-source"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline"
                    >
                        official OBS Browser Source documentation
                    </a>
                    .
                </p>
            </section>
        </article>
    );
};
