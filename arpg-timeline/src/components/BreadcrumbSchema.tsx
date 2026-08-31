interface Crumb {
    name: string;
    /** Absolute URL or a site-root-relative path. */
    href?: string;
    url?: string;
}

const SITE_URL = "https://www.arpg-timeline.com";

const toAbsolute = (value: string) =>
    value.startsWith("http") ? value : `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;

interface BreadcrumbSchemaProps {
    /** Legacy: derive crumbs from a "/"-joined path, title-casing each segment. */
    path?: string;
    /** Preferred: explicit crumbs with real labels. */
    crumbs?: Crumb[];
}

export const BreadcrumbSchema = ({ path, crumbs }: BreadcrumbSchemaProps) => {
    const items: { name: string; item: string }[] = crumbs
        ? crumbs.map((c) => ({ name: c.name, item: toAbsolute(c.href ?? c.url ?? "/") }))
        : (path ?? "")
              .split("/")
              .filter(Boolean)
              .map((segment, index, all) => ({
                  name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
                  item: `${SITE_URL}/${all.slice(0, index + 1).join("/")}`,
              }));

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((entry, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: entry.name,
            item: entry.item,
        })),
    };

    return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
};
