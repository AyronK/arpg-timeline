import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";

import { SEARCH_GAMES } from "@/lib/search/__fixtures__/searchGames";
import { SearchGame } from "@/lib/search/types";

import SearchPalette from "./SearchPalette";

const games: SearchGame[] = SEARCH_GAMES.map((game) => ({
    ...game,
    logoSrc: null,
    categories: [],
    isDormant: false,
    isComingSoon: false,
}));

const typeQuery = (query: string) => async () => {
    const input = await within(document.body).findByRole("combobox");
    await userEvent.type(input, query);
};

const meta: Meta<typeof SearchPalette> = {
    component: SearchPalette,
    title: "Components/Search/SearchPalette",
    parameters: {
        layout: "fullscreen",
        nextjs: { appDirectory: true },
    },
    args: {
        open: true,
        onOpenChange: () => {},
        games,
    },
};

export default meta;

type Story = StoryObj<typeof SearchPalette>;

export const QuickLinks: Story = {};

export const PagesAndActions: Story = {
    play: typeQuery("news"),
};

export const MixedGroups: Story = {
    play: typeQuery("d"),
};

export const Results: Story = {
    play: typeQuery("poe"),
};

export const AliasMatch: Story = {
    play: typeQuery("d4"),
};

export const WithLogos: Story = {
    args: {
        games: games.map((game, index) => ({
            ...game,
            logoSrc: index % 2 ? "/assets/logo.png" : null,
        })),
    },
    play: typeQuery("diablo"),
};

export const SquashedMatch: Story = {
    play: typeQuery("grimdawn"),
};

export const NoResults: Story = {
    play: typeQuery("qqzzx"),
};

export const Loading: Story = {
    args: { games: undefined },
    play: typeQuery("diablo"),
};
