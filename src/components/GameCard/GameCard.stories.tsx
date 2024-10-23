import type { Meta, StoryObj } from "@storybook/react";
import { GameCard } from "@/components/GameCard/GameCard";
import SeasonWidgetStories, {
  Current,
  Over,
  NextKnownDate,
  NextToBeAnnounced,
  JustStarted,
  CurrentEndUnknown,
  NextToBeAnnouncedEstimated,
} from "@/components/SeasonWidget/SeasonWidget.stories";
import { SeasonWidget, SeasonWidgetProps } from "@/components/SeasonWidget";

const meta = {
  args: {
    name: "Game",
    official: true,
    shortName: "sn",
    url: null,
    logo: (
      <img
        className="object-fit"
        src="https://imageplaceholder.net/600x400/eeeeee/131313?text=logo"
        alt="logo"
      />
    ),
  },
  tags: ["autodocs"],
  title: "Components/Game Card",
  component: GameCard,
  decorators: [
    (Story) => (
      <div className="max-w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentNextAnnounced: Story = {
  args: {
    children: (
      <>
        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...Current.args,
          } as SeasonWidgetProps)}
        />

        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...NextKnownDate.args,
          } as SeasonWidgetProps)}
        />
      </>
    ),
  },
};

export const NoCurrentNextAnnounced: Story = {
  args: {
    children: (
      <>
        <div className="min-h-[64px]" />
        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...NextKnownDate.args,
          } as SeasonWidgetProps)}
        />
      </>
    ),
  },
};

export const CurrentOverNextAnnounced: Story = {
  args: {
    children: (
      <>
        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...Over.args,
          } as SeasonWidgetProps)}
        />

        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...NextKnownDate.args,
          } as SeasonWidgetProps)}
        />
      </>
    ),
  },
};

export const CurrentNextToBeAnnounced: Story = {
  args: {
    children: (
      <>
        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...Current.args,
          } as SeasonWidgetProps)}
        />

        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...NextToBeAnnounced.args,
          } as SeasonWidgetProps)}
        />
      </>
    ),
  },
};

export const CurrentNextToBeAnnouncedEstimated: Story = {
  args: {
    children: (
      <>
        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...CurrentEndUnknown.args,
          } as SeasonWidgetProps)}
        />

        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...NextToBeAnnouncedEstimated.args,
          } as SeasonWidgetProps)}
        />
      </>
    ),
  },
};

export const JustStartedNextToBeAnnounced: Story = {
  args: {
    children: (
      <>
        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...JustStarted.args,
          } as SeasonWidgetProps)}
        />

        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...NextToBeAnnounced.args,
          } as SeasonWidgetProps)}
        />
      </>
    ),
  },
};

export const JustStartedNoNext: Story = {
  args: {
    children: (
      <>
        <SeasonWidget
          {...({
            ...SeasonWidgetStories.args,
            ...JustStarted.args,
          } as SeasonWidgetProps)}
        />
      </>
    ),
  },
};
