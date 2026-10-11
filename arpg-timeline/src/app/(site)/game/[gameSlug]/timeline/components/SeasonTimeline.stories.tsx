import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SanitySeason } from "@/lib/cms/queries/indexQuery";

import { buildTimelineEntries, groupByYear } from "../timeline";
import { SeasonTimeline } from "./SeasonTimeline";

const NOW = new Date("2026-03-21T12:00:00Z");
const GAME = "story-game";

const season = (
    id: string,
    name: string,
    start: string | null,
    extra: Partial<SanitySeason> = {},
): SanitySeason => ({
    _id: id,
    _updatedAt: "2026-01-01T00:00:00Z",
    _createdAt: "2026-01-01T00:00:00Z",
    name,
    game: GAME,
    start: start ? { startDate: start, confirmed: true } : { confirmed: false },
    ...extra,
});

const FULL: SanitySeason[] = [
    season("u1", "Season 9", null, { start: { confirmed: false, overrideText: "Summer 2026" } }),
    season("u2", "Season 8.5", "2026-06-01T00:00:00Z"),
    season("s8", "Season 8", "2026-02-01T00:00:00Z"),
    season("s75", "Weekend Event", "2025-12-05T00:00:00Z", {
        isSideEvent: true,
        end: { endDate: "2025-12-12T00:00:00Z", confirmed: true },
    }),
    season("s7", "Season 7", "2025-10-01T00:00:00Z"),
    season("s6", "Season 6", "2025-06-10T00:00:00Z"),
    season("s5", "Season 5", "2025-01-15T00:00:00Z"),
    season("s4", "Season 4", "2024-08-20T00:00:00Z"),
    season("s3", "Season 3", "2024-03-02T00:00:00Z"),
    season("s2", "A Very Long Season Name That Should Wrap Nicely On Small Screens", "2023-09-09T00:00:00Z"),
    season("s1", "Season 1", "2023-04-01T00:00:00Z"),
];

const Logo = {} as never;

const render = (seasons: SanitySeason[]) => (
    <SeasonTimeline groups={groupByYear(buildTimelineEntries(seasons, GAME, NOW))} gameLogo={Logo} />
);

const meta: Meta<typeof SeasonTimeline> = {
    component: SeasonTimeline,
    title: "Components/SeasonTimeline",
    parameters: { layout: "padded" },
    decorators: [
        (Story) => (
            <div className="container mx-auto max-w-4xl">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof SeasonTimeline>;

export const FullHistory: Story = { render: () => render(FULL) };

export const ShortHistory: Story = { render: () => render(FULL.slice(2, 5)) };

export const Mobile: Story = {
    render: () => render(FULL),
    parameters: { viewport: { defaultViewport: "mobile1" } },
};
