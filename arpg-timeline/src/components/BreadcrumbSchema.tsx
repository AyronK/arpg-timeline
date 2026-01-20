export const BreadcrumbSchema = ({ path }: { path: string }) => {
    const pathSegments = path.split("/").filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => ({
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
        url: `https://www.arpg-timeline.com/${pathSegments.slice(0, index + 1).join("/")}`,
    }));

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    };

    return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
};
