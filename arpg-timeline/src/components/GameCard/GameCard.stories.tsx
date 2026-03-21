import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GameCard } from "./GameCard";

const meta: Meta<typeof GameCard> = {
    component: GameCard,
    title: "Components/GameCard",
    decorators: [
        (Story) => (
            <div className="w-[480px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof GameCard>;

export const Default: Story = {
    args: {
        name: "Path of Exile 2",
        slug: "poe2",
        official: true,
        url: "https://www.pathofexile.com",
        gameLogo: (
            <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded text-xs">
                Logo
            </div>
        ),
        children: <p className="text-muted-foreground text-sm">Season content goes here.</p>,
    },
};
