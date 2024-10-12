import type { Meta, StoryObj } from "@storybook/react";
import { GameCard } from "@/components/GameCard/GameCard";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
import CurrentSeasonWidgetStory, {
  Over,
} from "../CurrentSeasonWidget/CurrentSeasonWidget.stories";
import NextSeasonWidgetStory, {
  KnownDate,
} from "../NextSeasonWidget/NextSeasonWidget.stories";

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

export const Default: Story = {
  args: {
    name: "New Season",
    group: null,
    official: true,
    shortName: "sn",
    slug: "slug",
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
    currentSeason: { ...CurrentSeasonWidgetStory.args, ...Over.args },
    nextSeason: { ...NextSeasonWidgetStory.args, ...KnownDate.args },
  },
};
