import type { Meta, StoryObj } from "@storybook/react";

import BackgroundParticles from "../pages/BackgroundParticles";

const meta: Meta<typeof BackgroundParticles> = {
  title: "Background Particles",
  decorators: [
    (Story) => (
      <div className="w-screen h-screen">
        <Story />
      </div>
    ),
  ],
  component: BackgroundParticles,
  args: {
    stage: "landing",
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof BackgroundParticles>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Landing: Story = {
  args: {
    stage: "landing",
  },
};

export const Main: Story = {
  args: {
    stage: "main",
  },
};
