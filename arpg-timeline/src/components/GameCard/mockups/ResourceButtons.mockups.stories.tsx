import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReactNode } from "react";

import { FooterActionsCard } from "./FooterActionsCard";
import { FooterActionsPackedCard } from "./FooterActionsPackedCard";
import { HeaderLabeledActionsCard } from "./HeaderLabeledActionsCard";
import { MOCK_GAMES, MockGameEntry } from "./mockGames";
import { RESOURCE_VARIANTS, ResourceSlot } from "./ResourceButtonVariants";
import { MockGameCard } from "./ResourceMockCard";

/**
 * MOCKUP ONLY — comparison stories for candidate designs of optional "Builds" / "Guides"
 * resource buttons on the dashboard game card. Nothing here is wired into the real GameCard or
 * site; see `ResourceMockCard.tsx`, `ResourceButtonVariants.tsx`, `HeaderLabeledActionsCard.tsx`
 * and `FooterActionsCard.tsx` for the mock building blocks.
 *
 * Each variant is judged against:
 *  1. Optional — 0, 1, or 2 buttons, no dead space or lopsided layout when one is missing.
 *  2. Looks fine when cards with different button counts sit side by side in the grid.
 *  3. Noticeable, but doesn't dominate the card.
 *  4. Compatible with the real dashboard grid (min-h-52 / md:min-h-80, 1→2→3 columns).
 *  5. Icon + text, never icon-only (except the pre-existing "More options" menu trigger).
 */

const renderSlotCard = (entry: MockGameEntry, variant: (typeof RESOURCE_VARIANTS)[number]) => {
    const ButtonComponent = variant.Component;
    const resourceNode = <ButtonComponent {...entry.resources} />;
    const slotProps: Record<ResourceSlot, ReactNode> = {
        headerExtra: undefined,
        headerActions: undefined,
    };
    slotProps[variant.slot] = resourceNode;

    return (
        <MockGameCard key={entry.game.slug} game={entry.game} {...slotProps}>
            {entry.body}
        </MockGameCard>
    );
};

type CardVariant = {
    key: string;
    label: string;
    description: string;
    render: (entry: MockGameEntry) => ReactNode;
};

const CARD_VARIANTS: CardVariant[] = [
    ...RESOURCE_VARIANTS.map(
        (variant): CardVariant => ({
            key: variant.key,
            label: variant.label,
            description: variant.description,
            render: (entry) => renderSlotCard(entry, variant),
        }),
    ),
    {
        key: "headerLabeled",
        label: "Header actions + labeled Details",
        description:
            '"Details" gains a text label like Builds/Guides (only "More" stays icon-only); badges move below the buttons, right-aligned.',
        render: (entry) => (
            <HeaderLabeledActionsCard
                key={entry.game.slug}
                game={entry.game}
                resources={entry.resources}
            >
                {entry.body}
            </HeaderLabeledActionsCard>
        ),
    },
    {
        key: "footerActions",
        label: "All actions in footer (reserved slots)",
        description:
            "Builds, Guides, Details and More share a fixed 4-column grid pinned to the card's bottom — each button keeps a dedicated position/width, but a missing button leaves a blank, bordered gap.",
        render: (entry) => (
            <FooterActionsCard key={entry.game.slug} game={entry.game} resources={entry.resources}>
                {entry.body}
            </FooterActionsCard>
        ),
    },
    {
        key: "footerActionsPacked",
        label: "All actions in footer (packed, right-anchored)",
        description:
            "Same footer toolbar, but only existing buttons render, packed together and anchored to the right edge — no dead space, and Details/More always sit in the same spot.",
        render: (entry) => (
            <FooterActionsPackedCard
                key={entry.game.slug}
                game={entry.game}
                resources={entry.resources}
            >
                {entry.body}
            </FooterActionsPackedCard>
        ),
    },
];

// The real dashboard grid (GamesAndEventsGrid.tsx), reproduced for the mockup stories.
const DASHBOARD_GRID_CLASS =
    "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3 [&>*]:min-h-52 md:[&>*]:min-h-80";

const DashboardGrid = ({ variant }: { variant: CardVariant }) => (
    <div className={DASHBOARD_GRID_CLASS}>
        {MOCK_GAMES.map((entry) => (
            <div className="flex" key={entry.game.slug}>
                {variant.render(entry)}
            </div>
        ))}
    </div>
);

const meta: Meta = {
    title: "Mockups/Game Card Resources",
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj;

/**
 * All variants at a glance, each showing a game with both Builds and Guides links.
 */
export const Overview: Story = {
    name: "Overview — all variants (single card each)",
    render: () => (
        <div className="flex flex-row flex-wrap items-start justify-center gap-6 p-6 md:p-10">
            {CARD_VARIANTS.map((variant) => (
                <div key={variant.key} className="flex w-[300px] flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-heading text-foreground text-sm font-semibold">
                            {variant.label}
                        </span>
                        <span className="text-muted-foreground text-xs">{variant.description}</span>
                    </div>
                    {variant.render(MOCK_GAMES[0])}
                </div>
            ))}
        </div>
    ),
};

// --- Header resource chips ------------------------------------------------------------------

const chipsVariant = CARD_VARIANTS.find((v) => v.key === "chips")!;

export const ChipsSingleCard: Story = {
    name: "Header resource chips — single card",
    parameters: { layout: "centered" },
    render: () => <div className="w-[480px]">{chipsVariant.render(MOCK_GAMES[0])}</div>,
};

export const ChipsDashboard: Story = {
    name: "Header resource chips — dashboard (mixed button counts)",
    render: () => (
        <div className="p-4 md:p-6">
            <DashboardGrid variant={chipsVariant} />
        </div>
    ),
};

// --- Header action buttons --------------------------------------------------------------------

const headerActionsVariant = CARD_VARIANTS.find((v) => v.key === "headerActions")!;

export const HeaderActionsSingleCard: Story = {
    name: "Header action buttons — single card",
    parameters: { layout: "centered" },
    render: () => <div className="w-[480px]">{headerActionsVariant.render(MOCK_GAMES[0])}</div>,
};

export const HeaderActionsDashboard: Story = {
    name: "Header action buttons — dashboard (mixed button counts)",
    render: () => (
        <div className="p-4 md:p-6">
            <DashboardGrid variant={headerActionsVariant} />
        </div>
    ),
};

// --- Header actions + labeled Details -----------------------------------------------------

const headerLabeledVariant = CARD_VARIANTS.find((v) => v.key === "headerLabeled")!;

export const HeaderLabeledSingleCard: Story = {
    name: "Header actions + labeled Details — single card",
    parameters: { layout: "centered" },
    render: () => <div className="w-[480px]">{headerLabeledVariant.render(MOCK_GAMES[0])}</div>,
};

export const HeaderLabeledDashboard: Story = {
    name: "Header actions + labeled Details — dashboard (mixed button counts)",
    render: () => (
        <div className="p-4 md:p-6">
            <DashboardGrid variant={headerLabeledVariant} />
        </div>
    ),
};

// --- All actions in footer (reserved slots) -------------------------------------------------

const footerActionsVariant = CARD_VARIANTS.find((v) => v.key === "footerActions")!;

export const FooterActionsSingleCard: Story = {
    name: "All actions in footer (reserved slots) — single card",
    parameters: { layout: "centered" },
    render: () => <div className="w-[480px]">{footerActionsVariant.render(MOCK_GAMES[0])}</div>,
};

export const FooterActionsDashboard: Story = {
    name: "All actions in footer (reserved slots) — dashboard (mixed button counts)",
    render: () => (
        <div className="p-4 md:p-6">
            <DashboardGrid variant={footerActionsVariant} />
        </div>
    ),
};

// --- All actions in footer (packed, right-anchored) -----------------------------------------

const footerActionsPackedVariant = CARD_VARIANTS.find((v) => v.key === "footerActionsPacked")!;

export const FooterActionsPackedSingleCard: Story = {
    name: "All actions in footer (packed, right-anchored) — single card",
    parameters: { layout: "centered" },
    render: () => (
        <div className="w-[480px]">{footerActionsPackedVariant.render(MOCK_GAMES[0])}</div>
    ),
};

export const FooterActionsPackedDashboard: Story = {
    name: "All actions in footer (packed, right-anchored) — dashboard (mixed button counts)",
    render: () => (
        <div className="p-4 md:p-6">
            <DashboardGrid variant={footerActionsPackedVariant} />
        </div>
    ),
};
