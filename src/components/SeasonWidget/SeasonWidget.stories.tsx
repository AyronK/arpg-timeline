import type { Meta, StoryObj } from "@storybook/react";

import { SeasonWidget } from "@/components/SeasonWidget/SeasonWidget";
import { CalendarMenu } from "@/components/CalendarMenu";
import LocalDate from "@/components/LocalDate";
import { Countdown } from "@/components/Countdown";
import {
  CalendarClock,
  CalendarOff,
  InfoIcon,
  Timer,
  TimerOff,
  TimerReset,
} from "lucide-react";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import { ProgressBar } from "@/components/ProgressBar";

const meta: Meta<typeof SeasonWidget> = {
  args: {
    name: "Season 40: Shades of the Nephalem",
  },
  tags: ["autodocs"],
  title: "Components/Season Widget",
  component: SeasonWidget,
  decorators: [
    (Story) => (
      <div className="max-w-80">
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SeasonWidget>;

export const NextToBeAnnounced: Story = {
  args: {
    chip: "next",
    name: "Next season to be announced",
  },
};

export const NextToBeAnnouncedEstimated: Story = {
  args: {
    chip: "next",
    name: "Next season to be announced",
    children: <IconLabel icon={TimerReset}>est. November/December</IconLabel>,
  },
};

export const NextKnownDate: Story = {
  args: {
    chip: "next",
    children: (
      <div className="flex flex-1 flex-col gap-1">
        <IconLabel icon={TimerReset}>
          Starts
          <span className="font-semibold">
            <LocalDate longDate utcDate={new Date().toUTCString()} />
          </span>
        </IconLabel>
        <FramedAction
          action={
            <CalendarMenu startDate={new Date().toUTCString()} title="title" />
          }
        >
          <Countdown date={new Date()} testProps={{ timeLeft: 45734895 }} />
        </FramedAction>
      </div>
    ),
  },
};

export const NextKnownDateWithWarning: Story = {
  args: {
    chip: "next",
    children: (
      <>
        <IconLabel icon={TimerReset}>
          Starts
          <span className="font-semibold">
            <LocalDate longDate utcDate={new Date().toUTCString()} />
          </span>
        </IconLabel>
        <FramedAction
          action={
            <CalendarMenu startDate={new Date().toUTCString()} title="title" />
          }
        >
          <Countdown date={new Date()} testProps={{ timeLeft: 45734895 }} />
        </FramedAction>
        <IconLabel icon={InfoIcon} className="text-xs" iconPosition="end">
          Starts at 5 p.m. PDT/CET/KST
        </IconLabel>
      </>
    ),
  },
};

export const Over = {
  args: {
    chip: "over",
    children: (
      <div className="flex flex-row justify-between">
        <IconLabel icon={TimerOff}>Lasted 35 days</IconLabel>
        <IconLabel icon={CalendarOff} iconPosition="end">
          <span>
            Ended <LocalDate dateOnly utcDate={new Date().toUTCString()} />
          </span>
        </IconLabel>
      </div>
    ),
  },
};

export const Current = {
  args: {
    chip: "now",
    children: (
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <IconLabel icon={Timer}>Lasted 35 days</IconLabel>
          <IconLabel icon={CalendarClock} iconPosition="end">
            130 days left
          </IconLabel>
        </div>
        <ProgressBar progress={33} />
      </div>
    ),
  },
};

export const CurrentEndUnknown = {
  args: {
    chip: "now",
    children: (
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <IconLabel icon={Timer}>Lasts 35 days</IconLabel>
          <IconLabel icon={CalendarClock} iconPosition="end">
            November/December
          </IconLabel>
        </div>
        <ProgressBar progress={33} />
      </div>
    ),
  },
};

export const JustStarted = {
  args: {
    chip: "live",
    children: (
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <IconLabel icon={TimerReset}>Just started</IconLabel>
          <IconLabel icon={CalendarClock} iconPosition="end">
            November/December
          </IconLabel>
        </div>
        <ProgressBar progress={5} />
      </div>
    ),
  },
};

export const CurrentWithWarning = {
  args: {
    chip: "now",
    children: (
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <IconLabel icon={Timer}>Lasted 35 days</IconLabel>
          <IconLabel icon={CalendarClock} iconPosition="end">
            130 days left
          </IconLabel>
        </div>
        <ProgressBar progress={33} />
        <IconLabel icon={InfoIcon} className="text-xs" iconPosition="end">
          Ladder resets at 5 p.m. PDT/CET/KST
        </IconLabel>
      </div>
    ),
  },
};
