import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HeaderToolbarCard } from "./HeaderToolbarCard";
import { DASHBOARD_GRID_CLASS, GAMES } from "./toolbarStoryFixtures";

/**
 * MOCKUP ONLY — comparison for a header-positioned placement of the shipped Builds/Guides/
 * Overview/More toolbar (currently pinned to the footer in the real GameCard). See
 * `HeaderToolbarCard.tsx` for the fork; nothing here is wired into the real GameCard or site.
 */

const meta: Meta = {
    title: "Mockups/GameCard Header Toolbar",
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj;

/**
 * Both Builds and Guides present, alongside Overview + More — the toolbar fills the header's
 * full width, right-anchored, same as the shipped footer placement.
 */
export const WithBuildsAndGuides: Story = {
    name: "Header toolbar — Builds + Guides + Overview + More",
    parameters: { layout: "centered" },
    render: () => (
        <div className="w-[480px]">
            <HeaderToolbarCard {...GAMES.lastEpoch} />
        </div>
    ),
};

/**
 * Only one resource link (Guides) — checks that the packed/right-anchored behavior still reads
 * cleanly at the top of the card, not just at the bottom.
 */
export const GuidesOnly: Story = {
    name: "Header toolbar — Guides only",
    parameters: { layout: "centered" },
    render: () => (
        <div className="w-[480px]">
            <HeaderToolbarCard {...GAMES.diabloGuidesOnly} />
        </div>
    ),
};

/**
 * No resources and noMenu — the toolbar is omitted entirely, same as the footer variant.
 */
export const NoActions: Story = {
    name: "Header toolbar — nothing to show (omitted)",
    parameters: { layout: "centered" },
    render: () => (
        <div className="w-[480px]">
            <HeaderToolbarCard {...GAMES.poe2NoResources} />
        </div>
    ),
};

/**
 * A small grid mixing button counts side by side (both / one / none), matching the real
 * dashboard's column layout, to sanity-check requirement #2 in the header position.
 */
export const Dashboard: Story = {
    name: "Header toolbar — dashboard (mixed button counts)",
    render: () => (
        <div className="p-4 md:p-6">
            <div className={DASHBOARD_GRID_CLASS}>
                {Object.entries(GAMES).map(([key, props]) => (
                    <div className="flex" key={key}>
                        <HeaderToolbarCard {...props} />
                    </div>
                ))}
            </div>
        </div>
    ),
};
