import type { Meta, StoryObj } from "@storybook/react";
import { GameCard } from "@/components/GameCard/GameCard";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
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
import { CurrentSeasonWidgetProps } from "../CurrentSeasonWidget";
import { NextSeasonWidgetProps } from "../NextSeasonWidget";

const meta = {
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
    name: "New Season",
    official: true,
    shortName: "sn",
    url: null,
    logo: (
      <GatsbyImage
        image={
          getImage({
            images: {
              fallback: {
                src: "https://web.poecdn.com/protected/image/layout/settlerslogo.png?v=1723154629762&key=Jjw7LpciEpGJCD-I8P_Y2A",
                srcSet: "",
                sizes: "",
              },
              sources: [],
            },
            layout: "fixed",
            width: 200,
            height: 140,
          } as ImageDataLike)!
        }
        alt={`logo`}
        className="my-auto"
      />
    ),
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
    name: "New Season",
    official: true,
    shortName: "sn",
    url: null,
    logo: (
      <GatsbyImage
        image={
          getImage({
            images: {
              fallback: {
                src: "https://web.poecdn.com/protected/image/layout/settlerslogo.png?v=1723154629762&key=Jjw7LpciEpGJCD-I8P_Y2A",
                srcSet: "",
                sizes: "",
              },
              sources: [],
            },
            layout: "fixed",
            width: 200,
            height: 140,
          } as ImageDataLike)!
        }
        alt={`logo`}
        className="my-auto"
      />
    ),
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
    name: "New Season",
    official: true,
    shortName: "sn",
    url: null,
    logo: (
      <GatsbyImage
        image={
          getImage({
            images: {
              fallback: {
                src: "https://web.poecdn.com/protected/image/layout/settlerslogo.png?v=1723154629762&key=Jjw7LpciEpGJCD-I8P_Y2A",
                srcSet: "",
                sizes: "",
              },
              sources: [],
            },
            layout: "fixed",
            width: 200,
            height: 140,
          } as ImageDataLike)!
        }
        alt={`logo`}
        className="my-auto"
      />
    ),
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
    name: "New Season",
    official: true,
    shortName: "sn",
    url: null,
    logo: (
      <GatsbyImage
        image={
          getImage({
            images: {
              fallback: {
                src: "https://web.poecdn.com/protected/image/layout/settlerslogo.png?v=1723154629762&key=Jjw7LpciEpGJCD-I8P_Y2A",
                srcSet: "",
                sizes: "",
              },
              sources: [],
            },
            layout: "fixed",
            width: 200,
            height: 140,
          } as ImageDataLike)!
        }
        alt={`logo`}
        className="my-auto"
      />
    ),
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
    name: "New Season",
    official: true,
    shortName: "sn",
    url: null,
    logo: (
      <GatsbyImage
        image={
          getImage({
            images: {
              fallback: {
                src: "https://web.poecdn.com/protected/image/layout/settlerslogo.png?v=1723154629762&key=Jjw7LpciEpGJCD-I8P_Y2A",
                srcSet: "",
                sizes: "",
              },
              sources: [],
            },
            layout: "fixed",
            width: 200,
            height: 140,
          } as ImageDataLike)!
        }
        alt={`logo`}
        className="my-auto"
      />
    ),
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
    name: "New Season",
    official: true,
    shortName: "sn",
    url: null,
    logo: (
      <GatsbyImage
        image={
          getImage({
            images: {
              fallback: {
                src: "https://web.poecdn.com/protected/image/layout/settlerslogo.png?v=1723154629762&key=Jjw7LpciEpGJCD-I8P_Y2A",
                srcSet: "",
                sizes: "",
              },
              sources: [],
            },
            layout: "fixed",
            width: 200,
            height: 140,
          } as ImageDataLike)!
        }
        alt={`logo`}
        className="my-auto"
      />
    ),
    currentSeason: {
      ...CurrentSeasonWidgetStory.args,
      ...JustStarted.args,
    } as CurrentSeasonWidgetProps,
    nextSeason: null,
  },
};

export const NoCurrentOverNextAnnounced: Story = {
  args: {
    name: "New Season",
    official: true,
    shortName: "sn",
    url: null,
    logo: (
      <GatsbyImage
        image={
          getImage({
            images: {
              fallback: {
                src: "https://web.poecdn.com/protected/image/layout/settlerslogo.png?v=1723154629762&key=Jjw7LpciEpGJCD-I8P_Y2A",
                srcSet: "",
                sizes: "",
              },
              sources: [],
            },
            layout: "fixed",
            width: 200,
            height: 140,
          } as ImageDataLike)!
        }
        alt={`logo`}
        className="my-auto"
      />
    ),
    currentSeason: null,
    nextSeason: {
      ...NextSeasonWidgetStory.args,
      ...KnownDate.args,
    } as NextSeasonWidgetProps,
  },
};
