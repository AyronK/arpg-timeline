import type { Meta, StoryObj } from "@storybook/react";
import { SeasonCard } from "@/components/SeasonCard/SeasonCard";
import { ImageDataLike } from "gatsby-plugin-image";

const meta = {
  title: "Components/Season Card",
  component: SeasonCard,
  decorators: [
    (Story) => (
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof SeasonCard>;

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
    logo: {
      images: {
        fallback: {
          src: "https://placehold.co/200x140/svg?text=game-logo",
          srcSet: "",
          sizes: "",
        },
        sources: [],
      },
      layout: "fixed",
      width: 200,
      height: 140,
    } as ImageDataLike,
    currentSeason: {
      startDate: "2024-03-21",
      endDate: "2024-06-20",
      title: "Season 2024",
      url: "/",
      startDateNotice: "March 21, 2024",
      endDateNotice: "June 20, 2024",
      justStarted: false,
    },
    nextSeason: {
      startDate: "2024-06-21",
      endDate: "2024-09-22",
      title: "Next 2024",
      url: "/",
      startDateNotice: "June 21, 2024",
      endDateNotice: "September 22, 2024",
      showCountdown: true,
    },
    seasonKeyword: "Season",
    testProps: {
      now: new Date(2024, 4, 1),
      timeLeft: 59 * 55 * 1000 * 22 * 11,
    },
  },
};
