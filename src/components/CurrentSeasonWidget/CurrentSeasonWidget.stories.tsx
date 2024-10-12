import type { Meta, StoryObj } from "@storybook/react";

import { CurrentSeasonWidget } from "@/components/CurrentSeasonWidget/CurrentSeasonWidget";
import LocalDate from "../LocalDate";

const meta: Meta<typeof CurrentSeasonWidget> = {
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
    gameName: "Test game",
    gameShortName: "tg",
    labelEnd: (
      <div>
        Ended <LocalDate utcDate={new Date().toUTCString()} />
      </div>
    ),
    progress: 100,
    name: "Season 40: Shades of the Nephalem",
  },
};

export const Current: Story = {
  args: {
    chip: "now",
    gameName: "Test game",
    gameShortName: "tg",
    labelStart: <div>Running for 35 days</div>,
    labelEnd: <div>130 days left</div>,
    progress: 33,
    name: "Season 40: Shades of the Nephalem",
  },
};

export const CurrentEndUnkown: Story = {
  args: {
    chip: "now",
    gameName: "Test game",
    gameShortName: "tg",
    labelStart: <div>Running for 90 days</div>,
    labelEnd: <div>~ est. December</div>,
    progress: 66,
    name: "Season 40: Shades of the Nephalem",
  },
};

export const JustStarted: Story = {
  args: {
    chip: "live",
    gameName: "Test game",
    gameShortName: "tg",
    labelStart: <div>Just started</div>,
    labelEnd: <div>~ est. December</div>,
    progress: 0,
    name: "Season 40: Shades of the Nephalem",
  },
};

