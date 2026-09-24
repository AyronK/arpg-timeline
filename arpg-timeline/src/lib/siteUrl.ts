export const SITE_URL = "https://www.arpg-timeline.com";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/seoimage.png`;

const SITE_HOSTS = new Set(["arpg-timeline.com", "www.arpg-timeline.com"]);

// Returns a site-relative path for own-domain or relative hrefs, null otherwise.
export function toInternalHref(href: string): string | null {
    if (/^[/#?]/.test(href) && !href.startsWith("//")) return href;
    if (!/^https?:\/\//i.test(href)) return null;
    try {
        const url = new URL(href);
        return SITE_HOSTS.has(url.hostname) ? `${url.pathname}${url.search}${url.hash}` : null;
    } catch {
        return null;
    }
}
