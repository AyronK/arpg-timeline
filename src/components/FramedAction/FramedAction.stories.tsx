import type { Meta, StoryObj } from "@storybook/react";

import { FramedAction } from "@/components/FramedAction/FramedAction";
import { CalendarMenu } from "@/components/CalendarMenu";
import { ShareMenu } from "@/components/ShareMenu";

const meta: Meta<typeof FramedAction> = {
  title: "Components/Framed Action",
  component: FramedAction,
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

type Story = StoryObj<typeof FramedAction>;

export const Default: Story = {
  args: {
    append: <CalendarMenu startDate={new Date().toISOString()} title="cal" />,
    children: "Content",
  },
};
export const Prepend: Story = {
  args: {
    prepend: <ShareMenu startDate={new Date().toISOString()} title="share" />,
    children: "Content",
  },
};

export const Append: Story = {
  args: {
    append: <CalendarMenu startDate={new Date().toISOString()} title="cal" />,
    children: "Content",
  },
};

export const PrependAndAppend: Story = {
  args: {
    prepend: <ShareMenu startDate={new Date().toISOString()} title="share" />,
    append: <CalendarMenu startDate={new Date().toISOString()} title="cal" />,
    children: "Content",
  },
};
