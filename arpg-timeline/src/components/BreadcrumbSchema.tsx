import type { Crumb } from "@/lib/articles/breadcrumbs";
import { SITE_URL } from "@/lib/siteUrl";

const toAbsolute = (value: string) =>
    value.startsWith("http") ? value : `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;

interface BreadcrumbSchemaProps {
    // `path`: title-cased from slug segments. `crumbs`: explicit labels (preferred).
    path?: string;
    crumbs?: Crumb[];
}

export const BreadcrumbSchema = ({ path, crumbs }: BreadcrumbSchemaProps) => {
    const items: { name: string; item: string }[] = crumbs
        ? crumbs.map((c) => ({ name: c.name, item: toAbsolute(c.href) }))
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
