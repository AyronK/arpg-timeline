"use client";

import { useEffect } from "react";

import { sa_event } from "@/lib/sa_event";

// New tabs steal focus, backgrounding the origin tab. Chromium deprioritizes network
// requests from hidden tabs, which can silently drop the analytics pixel. Delaying the
// window.open() until the hit is confirmed (or this timeout elapses) keeps the origin
// tab foregrounded for the critical send window.
const OUTBOUND_NAVIGATION_TIMEOUT_MS = 300;

export const SimpleAnalytics = () => {
    useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }

        const listener = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const saClickTarget = target.closest<HTMLElement>("[data-sa-click]");
            const saClickSource = saClickTarget?.dataset.saClick;
            if (!saClickTarget || !saClickSource) {
                return;
            }

            const anchor = saClickTarget.closest<HTMLAnchorElement>("a[href]");
            const isPlainLeftClick =
                e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
            const isHttpLink = anchor?.protocol === "http:" || anchor?.protocol === "https:";
            const opensInNewTab = !!anchor?.target && anchor.target !== "_self";
            const isExternalDomain = !!anchor && anchor.hostname !== window.location.hostname;

            // Same-tab, same-domain navigation isn't at risk: the pixel fires well before
            // the page unloads and there's no backgrounded-tab throttling to worry about.
            const needsDelay = isHttpLink && (opensInNewTab || isExternalDomain);

            // Skip anchors that already handle their own navigation (e.g. a confirmation
            // dialog before opening), signaled by them having called preventDefault first.
            if (anchor && needsDelay && isPlainLeftClick && !e.defaultPrevented) {
                e.preventDefault();

                let opened = false;
                const navigateNow = () => {
                    if (opened) return;
                    opened = true;
                    if (opensInNewTab) {
                        window.open(anchor.href, "_blank", "noopener,noreferrer");
                    } else {
                        window.location.href = anchor.href;
                    }
                };

                const timeoutId = window.setTimeout(navigateNow, OUTBOUND_NAVIGATION_TIMEOUT_MS);
                sa_event(`${saClickSource}-click`, () => {
                    window.clearTimeout(timeoutId);
                    navigateNow();
                });
                return;
            }

            sa_event(`${saClickSource}-click`);
        };

        document.addEventListener("click", listener);

        return () => {
            if (typeof document !== "undefined") {
                document.removeEventListener("click", listener);
            }
        };
    }, []);

    return null;
};
