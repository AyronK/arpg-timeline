import type { Meta, StoryObj } from "@storybook/react";
import SeasonCard from "./SeasonCard";
import { ImageDataLike } from "gatsby-plugin-image";
import React from "react";

const meta = {
  title: "Components/SeasonCard",
  component: SeasonCard,
  decorators: [
    (Story) => (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-12 gap-4 md:gap-8">
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
    title: "New Season",
    logo: {
      images: {
        fallback: {
          src: "https://placehold.co/200x140?text=ARPG Game",
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
