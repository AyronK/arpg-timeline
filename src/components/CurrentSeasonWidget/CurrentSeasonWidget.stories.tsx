import type { Meta, StoryObj } from "@storybook/react";

import { CurrentSeasonWidget } from "@/components/CurrentSeasonWidget/CurrentSeasonWidget";
import LocalDate from "@/components/LocalDate";
import {
  CalendarClock,
  CalendarOff,
  Timer,
  TimerOff,
  TimerReset,
} from "lucide-react";

const meta: Meta<typeof CurrentSeasonWidget> = {
  args: {
    "aria-label": `Current leauge`,
    srCurrentSeason: `What is the current Path of Exile league?`,
    srSeasonStart: `When did the current Path of Exile league start?`,
    srSeasonEnd: `When is the current Path of Exile league ending?`,
    srGameSeason: `poe league, Path of Exile league`,
  },
  tags: ["autodocs"],
  title: "Components/Current Season Widget",
  component: CurrentSeasonWidget,
  decorators: [
    (Story) => (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CurrentSeasonWidget>;

export const Over: Story = {
  args: {
    chip: "over",
    progressStart: (
      <div className="flex flex-row items-center gap-1" title="Lasted 35 days">
        <TimerOff className="h-4 w-4" />
        <span className="hidden md:flex">Lasted</span>
        35 days
      </div>
    ),
    progressEnd: (
      <div className="flex flex-row flex-nowrap items-center gap-1">
        <span className="hidden md:flex">Ended</span>
        <LocalDate dateOnly utcDate={new Date().toUTCString()} />
        <CalendarOff className="h-4 w-4" />
      </div>
    ),
    progress: 100,
    name: "Season 40: Shades of the Nephalem",
  },
};

export const Current: Story = {
  args: {
    chip: "now",
    progressStart: (
      <div
        className="flex flex-row items-center gap-1"
        title="Running for 35 days"
      >
        <Timer className="h-4 w-4" />
        <span className="hidden md:flex">Lasts </span>35 days
      </div>
    ),
    progressEnd: (
      <div className="flex flex-row flex-nowrap items-center gap-1">
        130 days left
        <CalendarClock className="h-4 w-4" />
      </div>
    ),
    progress: 33,
    name: "Season 40: Shades of the Nephalem",
  },
};

export const CurrentEndUnkown: Story = {
  args: {
    chip: "now",
    progressStart: (
      <div
        className="flex flex-row items-center gap-1"
        title="Running for 90 days"
      >
        <Timer className="h-4 w-4" />
        <span className="hidden md:flex">Lasts </span>90 days
      </div>
    ),
    progressEnd: (
      <div className="flex flex-row flex-nowrap items-center gap-1">
        ~est. December
        <CalendarClock className="h-4 w-4" />
      </div>
    ),
    progress: 66,
    name: "Season 40: Shades of the Nephalem",
  },
};

export const JustStarted: Story = {
  args: {
    chip: "live",
    progressStart: (
      <div
        className="flex flex-row items-center gap-1"
        title="Running for 35 days"
      >
        <TimerReset className="h-4 w-4" />
        Just started
      </div>
    ),
    progressEnd: (
      <div className="flex flex-row flex-nowrap items-center gap-1 md:flex">
        ~est. December
        <CalendarClock className="h-4 w-4" />
      </div>
    ),
    progress: 0,
    name: "Season 40: Shades of the Nephalem",
  },
};
