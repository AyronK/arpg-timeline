import type { Meta, StoryObj } from "@storybook/react";

import { FramedAction } from "@/components/FramedAction/FramedAction";
import { CalendarMenu } from "@/components/CalendarMenu";

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
    action: <CalendarMenu startDate={new Date().toISOString()} title="cal" />,
    children: "Content",
  },
};
