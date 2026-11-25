import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";

import { Game } from "@/lib/cms/games.types";
import { COMMUNITY_SLUGS, SEARCH_GAMES } from "@/lib/search/__fixtures__/searchGames";
import { DashboardStatus } from "@/lib/search/dashboardStatus";
import { DashboardSearch, SearchGame } from "@/lib/search/types";

import SearchPalette from "./SearchPalette";

const games: SearchGame[] = SEARCH_GAMES.map((game) => ({
    ...game,
    logoSrc: null,
    categories: COMMUNITY_SLUGS.has(game.slug) ? ["community"] : [],
    isDormant: false,
    isComingSoon: false,
    url: `https://${game.slug}.example.com`,
}));

const DAY = 24 * 60 * 60 * 1000;
const inDays = (days: number) => new Date(Date.now() + days * DAY).toISOString();

const STATUSES: DashboardStatus[] = [
    { kind: "visible" },
    { kind: "hidden" },
    { kind: "other-tab" },
];

const SEASONS: Partial<Game>[] = [
    {
        nextSeason: {
            _id: "n",
            _updatedAt: "",
            name: "",
            start: { startDate: inDays(3), confirmed: true },
        },
    },
    {
        currentSeason: {
            _id: "c",
            _updatedAt: "",
            name: "",
            start: { startDate: inDays(-30) },
            end: { endDate: inDays(12), confirmed: true },
        },
    },
    {},
];

const dashboard: DashboardSearch = {
    category: "featured",
    games,
    details: new Map(
        games.map((game, index) => [
            game.slug,
            {
                game: {
                    ...game,
                    _id: game.slug,
                    _updatedAt: "",
                    _createdAt: "",
                    seasonKeyword: "season",
                    url: null,
                    logo: {} as Game["logo"],
                    isOfficial: true,
                    ...SEASONS[index % SEASONS.length],
                },
                status: STATUSES[index % STATUSES.length]!,
            },
        ]),
    ),
    openFilters: () => {},
    showGame: () => {},
};

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

export const MobileSheet: Story = {
    globals: { viewport: { value: "mobile1", isRotated: false } },
    play: typeQuery("poe"),
};

export const OnDashboard: Story = {
    args: { games: undefined, dashboard },
    play: typeQuery("diablo"),
};

export const DashboardQuickLinks: Story = {
    args: { games: undefined, dashboard },
};
