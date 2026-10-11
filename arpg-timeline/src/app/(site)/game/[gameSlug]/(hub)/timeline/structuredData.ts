import { TimelineEntry } from "./timeline";

export const buildTimelineItemList = (entries: TimelineEntry[], name: string, pageUrl: string) => {
    // Dated main seasons only; side events and undated entries aren't seasons
    const seasons = entries.filter((e) => !e.isSideEvent && e.startDate);

    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        numberOfItems: seasons.length,
        itemListElement: seasons.map((entry, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
                "@type": "Event",
                name: entry.name,
                startDate: entry.startDate!.toISOString(),
                eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
                location: { "@type": "VirtualLocation", url: pageUrl },
            },
        })),
    };
};
