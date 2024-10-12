import type { Meta, StoryObj } from "@storybook/react";

import { NextSeasonWidget } from "@/components/NextSeasonWidget/NextSeasonWidget";
import { CalendarMenu } from "@/components/CalendarMenu";
import LocalDate from "@/components/LocalDate";
import { Countdown } from "@/components/Countdown";
import { InfoIcon, TimerReset } from "lucide-react";

const meta: Meta<typeof NextSeasonWidget> = {
  args: {
    name: "Season 40: Shades of the Nephalem",
    "aria-label": `Next leauge`,
    srNextSeason: `What is the next Path of Exile league?`,
    srSeasonStart: `When did the next Path of Exile league start?`,
    srGameSeason: `poe league, Path of Exile league`,
  },
  tags: ["autodocs"],
  title: "Components/Next Season Widget",
  component: NextSeasonWidget,
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

type Story = StoryObj<typeof NextSeasonWidget>;

export const ToBeAnnounced: Story = {
  args: {
    name: "Next season to be announced",
  },
};

export const ToBeAnnouncedEstimated: Story = {
  args: {
    startLabel: (
      <div className="flex flex-row items-center gap-1">
        <TimerReset className="h-4 w-4" />
        est. November/December
      </div>
    ),
    name: "Next season to be announced",
  },
};

export const KnownDate: Story = {
  args: {
    startLabel: (
      <div className="flex flex-row items-center gap-1">
        <TimerReset className="h-4 w-4" />
        Starts
        <LocalDate longDate utcDate={new Date().toUTCString()} />
      </div>
    ),
    timer: <Countdown date={new Date()} testProps={{ timeLeft: 9845734895 }} />,
    action: (
      <div className="flex flex-row gap-2">
        <CalendarMenu startDate={new Date().toUTCString()} title="title" />
      </div>
    ),
  },
};

export const KnownDateWithFooter: Story = {
  args: {
    ...KnownDate.args,
    footer: (
      <div className="flex flex-row flex-nowrap items-center gap-1 md:flex">
        <InfoIcon className="h-4 w-4" />
        Starts at 5 p.m. PDT/CET/KST
      </div>
    ),
  },
};
