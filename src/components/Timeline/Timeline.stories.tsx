import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "@/components/Timeline/Timeline";

const meta = {
  title: "Components/Timeline",
  component: Timeline,
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const currentDate = new Date();
const referralDate = new Date(
  `2024-07-24T${new Date().toISOString().split("T")[1]}`,
);

const getUpdatedDate = (date: Date, currentDate: Date) => {
  return new Date(
    currentDate.getTime() + Math.floor(date.getTime() - referralDate.getTime()),
  );
};

export const Default: Story = {
  args: {
    events: [
      {
        name: "3.24 - Necropolis",
        game: "Path of Exile",
        gameShort: "PoE",
        startDate: getUpdatedDate(
          new Date("2024-03-29T20:00:00.000Z"),
          currentDate,
        ),
        startDateNotice: "",
        endDate: getUpdatedDate(
          new Date("2024-07-23T07:00:00.000Z"),
          currentDate,
        ),
        endDateNotice: "",
      },
      {
        name: "3.25 - Settlers of Kalguur",
        game: "Path of Exile",
        gameShort: "PoE",
        startDate: getUpdatedDate(
          new Date("2024-07-26T20:00:00.000Z"),
          currentDate,
        ),
        startDateNotice: "",
        endDate: getUpdatedDate(
          new Date("2024-11-03T20:00:00.000Z"),
          currentDate,
        ),
        endDateNotice: "",
      },
      {
        name: "Season IV - Loot reborn",
        game: "Diablo IV",
        gameShort: "D4",
        startDate: getUpdatedDate(
          new Date("2024-05-14T17:00:00.000Z"),
          currentDate,
        ),
        startDateNotice: null,
        endDate: getUpdatedDate(
          new Date("2024-08-06T17:00:00.000Z"),
          currentDate,
        ),
        endDateNotice: "",
      },
      {
        name: "Next Season - Season V",
        game: "Diablo IV",
        gameShort: "D4",
        startDate: getUpdatedDate(
          new Date("2024-08-06T17:00:00.000Z"),
          currentDate,
        ),
        startDateNotice: "",
        endDate: getUpdatedDate(
          new Date("2024-11-14T17:00:00.000Z"),
          currentDate,
        ),
        endDateNotice: "",
      },
      {
        name: "Season 4",
        game: "Hero Siege",
        gameShort: "HS",
        startDate: getUpdatedDate(
          new Date("2024-06-07T12:00:00.000Z"),
          currentDate,
        ),
        startDateNotice: null,
        endDate: getUpdatedDate(
          new Date("2024-08-09T12:00:00.000Z"),
          currentDate,
        ),
        endDateNotice: "Estimated ~ 9th or 16th August",
      },
      {
        name: "Season 5",
        game: "Hero Siege",
        gameShort: "HS",
        startDate: getUpdatedDate(
          new Date("2024-08-09T12:00:00.000Z"),
          currentDate,
        ),
        startDateNotice: "Estimated ~ 9th or 16th August",
        endDate: getUpdatedDate(
          new Date("2024-11-17T12:00:00.000Z"),
          currentDate,
        ),
        endDateNotice: "",
      },
      {
        name: "Season 7",
        game: "Diablo II: Resurrected",
        gameShort: "D2",
        startDate: getUpdatedDate(
          new Date("2024-05-23T17:00:00.000Z"),
          currentDate,
        ),
        startDateNotice: null,
        endDate: getUpdatedDate(
          new Date("2024-08-23T17:00:00.000Z"),
          currentDate,
        ),
        endDateNotice: "Estimated ~ August 2024",
      },
      {
        name: "Season 8",
        game: "Diablo II: Resurrected",
        gameShort: "D2",
        startDate: getUpdatedDate(
          new Date("2024-08-23T17:00:00.000Z"),
          currentDate,
        ),
        startDateNotice: "Estimated ~ August 2024",
        endDate: getUpdatedDate(
          new Date("2024-12-01T17:00:00.000Z"),
          currentDate,
        ),
        endDateNotice: "",
      },
      {
        name: "Season 9 - Anarchy",
        game: "Project Diablo 2",
        gameShort: "PD2",
        startDate: getUpdatedDate(
          new Date("2024-04-12T17:00:00.000Z"),
          currentDate,
        ),
        startDateNotice: null,
        endDate: getUpdatedDate(
          new Date("2024-08-30T17:00:00.000Z"),
          currentDate,
        ),
        endDateNotice: "Estimated ~ August/September",
      },
      {
        name: "Season 10",
        game: "Project Diablo 2",
        gameShort: "PD2",
        startDate: getUpdatedDate(
          new Date("2024-08-30T17:00:00.000Z"),
          currentDate,
        ),
        startDateNotice: "Estimated ~ August/September",
        endDate: getUpdatedDate(
          new Date("2024-12-08T17:00:00.000Z"),
          currentDate,
        ),
        endDateNotice: "",
      },
    ],
  },
};
