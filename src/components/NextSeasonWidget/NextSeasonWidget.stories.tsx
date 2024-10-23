import type { Meta, StoryObj } from "@storybook/react";

import { NextSeasonWidget } from "@/components/NextSeasonWidget/NextSeasonWidget";
import { CalendarMenu } from "@/components/CalendarMenu";
import LocalDate from "@/components/LocalDate";
import { Countdown } from "@/components/Countdown";
import { InfoIcon, TimerReset } from "lucide-react";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { IconLabel } from "@/components/IconLabel/IconLabel";

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
    name: "Next season to be announced",
    children: <IconLabel icon={TimerReset}>est. November/December</IconLabel>,
  },
};

export const KnownDate: Story = {
  args: {
    children: (
      <div className="flex flex-1 items-center">
        <div className="flex flex-1 flex-col gap-4">
          <IconLabel icon={TimerReset}>
            Starts
            <LocalDate longDate utcDate={new Date().toUTCString()} />
          </IconLabel>
          <FramedAction
            action={
              <CalendarMenu
                startDate={new Date().toUTCString()}
                title="title"
              />
            }
          >
            <Countdown date={new Date()} testProps={{ timeLeft: 45734895 }} />
          </FramedAction>
        </div>
      </div>
    ),
  },
};

export const KnownDateWithWarning: Story = {
  args: {
    ...KnownDate.args,

    children: (
      <div className="flex flex-1 items-center">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-row justify-between">
            <IconLabel icon={TimerReset}>
              Starts
              <LocalDate longDate utcDate={new Date().toUTCString()} />
            </IconLabel>
            <IconLabel icon={InfoIcon} iconPosition="end">
              Starts at 5 p.m. PDT/CET/KST
            </IconLabel>
          </div>
          <FramedAction
            action={
              <CalendarMenu
                startDate={new Date().toUTCString()}
                title="title"
              />
            }
          >
            <Countdown date={new Date()} testProps={{ timeLeft: 45734895 }} />
          </FramedAction>
        </div>
      </div>
    ),
  },
};
