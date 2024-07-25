import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "@/ui/Chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Text" },
};
