import type { Meta, StoryObj } from "@storybook/react";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import { Check } from "lucide-react";

const meta: Meta<typeof IconLabel> = {
  args: {
    children: "Text",
    icon: Check,
  },
  tags: ["autodocs"],
  title: "Components/Icon Label",
  component: IconLabel,
  decorators: [
    (Story) => (
      <div className="flex items-start">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof IconLabel>;

export const Start: Story = {
  args: { iconPosition: "start" },
};

export const End: Story = {
  args: { iconPosition: "end" },
};

export const Customized: Story = {
  args: { className: "font-heading font-bold", iconClassName: "w-5 h-5" },
};
