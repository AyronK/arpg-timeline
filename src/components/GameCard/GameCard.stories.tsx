import type { Meta, StoryObj } from "@storybook/react";
import { GameCard } from "@/components/GameCard/GameCard";
import CurrentSeasonWidgetStory, {
  Over,
  Current,
  CurrentEndUnkown,
  JustStarted,
} from "@/components/CurrentSeasonWidget/CurrentSeasonWidget.stories";
import NextSeasonWidgetStory, {
  KnownDate,
  ToBeAnnounced,
  ToBeAnnouncedEstimated,
} from "@/components/NextSeasonWidget/NextSeasonWidget.stories";
import { CurrentSeasonWidgetProps } from "@/components/CurrentSeasonWidget";
import { NextSeasonWidgetProps } from "@/components/NextSeasonWidget";

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
  title: "Components/Game Card",
  component: GameCard,
  decorators: [
    (Story) => (
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentNextAnnounced: Story = {
  args: {
    currentSeason: {
      ...CurrentSeasonWidgetStory.args,
      ...Current.args,
    } as CurrentSeasonWidgetProps,
    nextSeason: {
      ...NextSeasonWidgetStory.args,
      ...KnownDate.args,
    } as NextSeasonWidgetProps,
  },
};

export const CurrentOverNextAnnounced: Story = {
  args: {
    currentSeason: {
      ...CurrentSeasonWidgetStory.args,
      ...Over.args,
    } as CurrentSeasonWidgetProps,
    nextSeason: {
      ...NextSeasonWidgetStory.args,
      ...KnownDate.args,
    } as NextSeasonWidgetProps,
  },
};

export const CurrentNextToBeAnnounced: Story = {
  args: {
    currentSeason: {
      ...CurrentSeasonWidgetStory.args,
      ...Current.args,
    } as CurrentSeasonWidgetProps,
    nextSeason: {
      ...NextSeasonWidgetStory.args,
      ...ToBeAnnounced.args,
    } as NextSeasonWidgetProps,
  },
};

export const CurrentNextToBeAnnouncedEstimated: Story = {
  args: {
    currentSeason: {
      ...CurrentSeasonWidgetStory.args,
      ...CurrentEndUnkown.args,
    } as CurrentSeasonWidgetProps,
    nextSeason: {
      ...NextSeasonWidgetStory.args,
      ...ToBeAnnouncedEstimated.args,
    } as NextSeasonWidgetProps,
  },
};

export const JustStartedNextToBeAnnounced: Story = {
  args: {
    currentSeason: {
      ...CurrentSeasonWidgetStory.args,
      ...JustStarted.args,
    } as CurrentSeasonWidgetProps,
    nextSeason: {
      ...NextSeasonWidgetStory.args,
      ...ToBeAnnounced.args,
    } as NextSeasonWidgetProps,
  },
};

export const JustStartedNoNext: Story = {
  args: {
    currentSeason: {
      ...CurrentSeasonWidgetStory.args,
      ...JustStarted.args,
    } as CurrentSeasonWidgetProps,
    nextSeason: null,
  },
};

export const NoCurrentOverNextAnnounced: Story = {
  args: {
    currentSeason: null,
    nextSeason: {
      ...NextSeasonWidgetStory.args,
      ...KnownDate.args,
    } as NextSeasonWidgetProps,
  },
};
