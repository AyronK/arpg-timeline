import { ReactNode } from "react";

import { ResourceLinks } from "./ResourceButtonVariants";
import {
    dormantSeasonBody,
    estimateOnlySeasonBody,
    fullSeasonBody,
    MockGame,
} from "./ResourceMockCard";

export type MockGameEntry = {
    game: MockGame;
    resources: ResourceLinks;
    body: ReactNode;
};

/**
 * Six sample games covering every resource combination (both / builds-only / guides-only /
 * none) crossed with three season-body heights (full countdown, estimate-only, dormant/single
 * widget), so the dashboard mockups prove the buttons hold up next to mismatched neighbours.
 */
export const MOCK_GAMES: MockGameEntry[] = [
    {
        game: { name: "Last Epoch", slug: "last-epoch", official: true, steamPlayers: 12400 },
        resources: { buildsUrl: "#builds", guidesUrl: "#guides" },
        body: fullSeasonBody({
            currentName: "Season 3: Beneath Ancient Skies",
            startedDaysAgo: 15,
            progress: 15,
            nextName: "Season 4 - Shattered Omens",
            nextInDays: 15,
        }),
    },
    {
        game: { name: "Diablo III", slug: "d3", official: true, steamPlayers: 5000000 },
        resources: { buildsUrl: "#builds" },
        body: fullSeasonBody({
            currentName: "Season 37: The Forbidden Archives",
            startedDaysAgo: 15,
            progress: 20,
            nextName: "Season 38: Ethereal Memory",
            nextInDays: 7,
        }),
    },
    {
        game: { name: "Hero Siege", slug: "hero-siege", official: false },
        resources: { guidesUrl: "#guides" },
        body: fullSeasonBody({
            currentName: "Season 8",
            startedDaysAgo: 120,
            progress: 85,
            nextName: "Season 9 - INCARNATION",
            nextInDays: 20,
        }),
    },
    {
        game: { name: "Path of Exile 2", slug: "poe2", official: true, steamPlayers: 45000 },
        resources: {},
        body: estimateOnlySeasonBody({
            currentName: "0.40 - The Last of the Druids",
            startedDaysAgo: 15,
            progress: 20,
            nextEstimate: "April/May",
        }),
    },
    {
        game: { name: "Dwarven Realms", slug: "dwarven-realms", official: false },
        resources: { buildsUrl: "#builds", guidesUrl: "#guides" },
        body: estimateOnlySeasonBody({
            currentName: "Season 55: Return of the Dwarven King",
            startedDaysAgo: 64,
            progress: 35,
            nextEstimate: "Avg. 6 months",
        }),
    },
    {
        game: { name: "The Stormcaller", slug: "stormcaller", official: true, steamPlayers: 210 },
        resources: { guidesUrl: "#guides" },
        body: dormantSeasonBody({ releaseLabel: "Released on Jan 19, 2025" }),
    },
];
