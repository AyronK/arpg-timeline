import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";
import { ImageDataLike } from "gatsby-plugin-image";

const meta = {
    title: "Components/Card",
    component: Card,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'Spring Season',
        logo: {
            images: {
                fallback: {
                    src: 'https://placehold.co/200x140?text=Logo',
                    srcSet: '',
                    sizes: '',
                },
                sources: [],
            },
            layout: 'fixed',
            width: 150,
            height: 150,
        } as ImageDataLike,
        currentSeason: {
            startDate: '2024-03-21',
            endDate: '2024-06-20',
            title: 'Spring 2024',
            url: 'https://example.com/spring2024',
            startDateNotice: 'Spring starts on March 21, 2024',
            endDateNotice: 'Spring ends on June 20, 2024',
        },
        nextSeason: {
            startDate: '2024-06-21',
            endDate: '2024-09-22',
            title: 'Summer 2024',
            url: 'https://example.com/summer2024',
            startDateNotice: 'Summer starts on June 21, 2024',
            endDateNotice: 'Summer ends on September 22, 2024',
            showCountdown: true,
        },
        seasonKeyword: 'Spring',
    },
};
