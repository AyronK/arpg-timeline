import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CalendarMenu } from "@/components/CalendarMenu";
import { Countdown } from "@/components/Countdown";
import { ShareMenu } from "@/components/ShareMenu";

import { FramedAction } from "./FramedAction";

// Stable mock dates relative to 2026-03-21
const NOW = new Date("2026-03-21T12:00:00Z");
const daysMs = (n: number) => n * 24 * 60 * 60 * 1000;
const NEXT_DATE = new Date(NOW.getTime() + daysMs(15)).toISOString(); // Apr 05
const NEXT_SOON = new Date(NOW.getTime() + daysMs(1) - 1).toISOString(); // < 24h away

const meta: Meta<typeof FramedAction> = {
    component: FramedAction,
    title: "Components/FramedAction",
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="w-[480px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof FramedAction>;

/**
 * Days-only variant: shows just the number of full days remaining.
 * When less than 24 hours are left, displays "1 day" as the minimum.
 */
export const DaysOnly: Story = {
    name: "Days-only — Share + Days countdown + Calendar",
    args: {
        prepend: (
            <ShareMenu
                startDate={NEXT_DATE}
                title="Hey, Last Epoch Season 4 - Shattered Omens launch is happening"
            />
        ),
        append: (
            <CalendarMenu
                startDate={NEXT_DATE}
                title="Last Epoch Season 4 - Shattered Omens launch"
                gameSlug="last-epoch"
                gameName="Last Epoch"
            />
        ),
        children: <Countdown variant="days" date={new Date(NEXT_DATE)} />,
    },
};

/**
 * Days-only variant under the 24-hour threshold — shows "Today".
 */
export const DaysOnlyUnder24h: Story = {
    name: "Days-only — under 24h (shows Today)",
    args: {
        prepend: (
            <ShareMenu
                startDate={NEXT_SOON}
                title="Hey, Last Epoch Season 4 - Shattered Omens launch is happening"
            />
        ),
        append: (
            <CalendarMenu
                startDate={NEXT_SOON}
                title="Last Epoch Season 4 - Shattered Omens launch"
                gameSlug="last-epoch"
                gameName="Last Epoch"
            />
        ),
        children: <Countdown variant="days" date={new Date(NEXT_SOON)} />,
    },
};

/**
 * The standard countdown row: Share on the left, Calendar on the right,
 * countdown timer in the centre. Used on game cards on the main dashboard.
 */
export const WithShareAndCalendar: Story = {
    name: "Standard — Share + Countdown + Calendar",
    args: {
        prepend: (
            <ShareMenu
                startDate={NEXT_DATE}
                title="Hey, Last Epoch Season 4 - Shattered Omens launch is happening"
            />
        ),
        append: (
            <CalendarMenu
                startDate={NEXT_DATE}
                title="Last Epoch Season 4 - Shattered Omens launch"
                gameSlug="last-epoch"
                gameName="Last Epoch"
            />
        ),
        children: <Countdown date={new Date(NEXT_DATE)} />,
    },
};

/**
 * Embed variant: no Share/Calendar actions, padded container with a subtle
 * emerald ring. Used inside the season embed widget (non-compact).
 */
export const EmbedMode: Story = {
    name: "Embed — Countdown only (with ring)",
    decorators: [
        (Story) => (
            <div className="w-[480px]">
                <div className="mt-auto rounded-sm ring ring-emerald-200/40">
                    <Story />
                </div>
            </div>
        ),
    ],
    args: {
        className: "p-1",
        children: <Countdown date={new Date(NEXT_DATE)} />,
    },
};

/**
 * Compact embed variant: no Share/Calendar actions, transparent background,
 * no shadow, drop-shadow on text, and the parent scales up 1.25×.
 * Used inside the compact season embed widget.
 */
export const CompactEmbed: Story = {
    name: "Compact embed — Countdown only (transparent, scaled)",
    decorators: [
        (Story) => (
            <div className="w-[480px]">
                <div className="mt-auto scale-125 rounded-sm">
                    <Story />
                </div>
            </div>
        ),
    ],
    args: {
        className:
            "bg-transparent! shadow-none! [text-shadow:_0_1px_1px_rgba(0,0,0,0.4)]",
        children: <Countdown date={new Date(NEXT_DATE)} />,
    },
};
