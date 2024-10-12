import type { Meta, StoryObj } from "@storybook/react";

import { NextSeasonWidget } from "@/components/NextSeasonWidget/NextSeasonWidget";
import { CalendarMenu } from "../CalendarMenu";
import LocalDate from "../LocalDate";
import { Countdown } from "../Countdown";
import { TrailingBorder } from "../TrailingBorder";
import { TimerReset } from "lucide-react";

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
    name: "To be announced",
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
    name: "To be announced",
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
