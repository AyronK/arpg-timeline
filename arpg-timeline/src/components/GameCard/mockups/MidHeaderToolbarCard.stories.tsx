import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MidHeaderToolbarCard } from "./MidHeaderToolbarCard";
import { DASHBOARD_GRID_CLASS, GAMES } from "./toolbarStoryFixtures";

/**
 * MOCKUP ONLY — comparison for a mid-header placement of the shipped Builds/Guides/Overview/More
 * toolbar: sandwiched between the title/badges row and the logo, instead of pinned to the top or
 * bottom edge. See `MidHeaderToolbarCard.tsx` for the fork; nothing here is wired into the real
 * GameCard or site.
 */

const meta: Meta = {
    title: "Mockups/GameCard Mid-Header Toolbar",
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj;

/**
 * Both Builds and Guides present, alongside Overview + More — sandwiched between the title row
 * and the logo, with a divider on both edges instead of bleeding to a card corner.
 */
export const WithBuildsAndGuides: Story = {
    name: "Mid-header toolbar — Builds + Guides + Overview + More",
    parameters: { layout: "centered" },
    render: () => (
        <div className="w-[480px]">
            <MidHeaderToolbarCard {...GAMES.lastEpoch} />
        </div>
    ),
};

/**
 * Only one resource link (Guides) — checks the packed/right-anchored behavior still reads
 * cleanly when sandwiched, not just at a card edge.
 */
export const GuidesOnly: Story = {
    name: "Mid-header toolbar — Guides only",
    parameters: { layout: "centered" },
    render: () => (
        <div className="w-[480px]">
            <MidHeaderToolbarCard {...GAMES.diabloGuidesOnly} />
        </div>
    ),
};

/**
 * No resources and noMenu — the toolbar is omitted entirely, same as the other placements.
 */
export const NoActions: Story = {
    name: "Mid-header toolbar — nothing to show (omitted)",
    parameters: { layout: "centered" },
    render: () => (
        <div className="w-[480px]">
            <MidHeaderToolbarCard {...GAMES.poe2NoResources} />
        </div>
    ),
};

/**
 * A small grid mixing button counts side by side (both / one / none), matching the real
 * dashboard's column layout, to sanity-check requirement #2 in the mid-header position.
 */
export const Dashboard: Story = {
    name: "Mid-header toolbar — dashboard (mixed button counts)",
    render: () => (
        <div className="p-4 md:p-6">
            <div className={DASHBOARD_GRID_CLASS}>
                {Object.entries(GAMES).map(([key, props]) => (
                    <div className="flex" key={key}>
                        <MidHeaderToolbarCard {...props} />
                    </div>
                ))}
            </div>
        </div>
    ),
};
