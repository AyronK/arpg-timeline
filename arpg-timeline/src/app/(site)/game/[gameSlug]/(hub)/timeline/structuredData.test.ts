import { describe, expect, it } from "vitest";

import { buildTimelineItemList } from "./structuredData";
import { TimelineEntry } from "./timeline";

const entry = (overrides: Partial<TimelineEntry>): TimelineEntry => ({
    id: "a",
    name: "Season A",
    isSideEvent: false,
    status: "past",
    startDate: new Date("2025-01-01T00:00:00Z"),
    startLabel: "Jan 1, 2025",
    localizeStart: true,
    durationDays: 90,
    ...overrides,
});

describe("buildTimelineItemList", () => {
    it("lists dated main seasons with name and startDate", () => {
        const list = buildTimelineItemList(
            [
                entry({}),
                entry({ id: "side", name: "Side", isSideEvent: true }),
                entry({ id: "tba", name: "TBA", startDate: null, status: "upcoming" }),
            ],
            "Game timeline",
            "https://example.com/game/x/timeline",
        );
        expect(list.numberOfItems).toBe(1);
        expect(list.itemListElement).toHaveLength(1);
        expect(list.itemListElement[0]!.item).toMatchObject({
            name: "Season A",
            startDate: "2025-01-01T00:00:00.000Z",
        });
    });
});
