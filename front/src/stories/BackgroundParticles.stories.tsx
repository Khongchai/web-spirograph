import type { Meta, StoryObj } from "@storybook/react";

import BackgroundParticles from "../pages/BackgroundParticles";
import { within } from "@testing-library/react";
import { expect } from "@storybook/jest";

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas).toBeTruthy();
  },
  args: {
    stage: "landing",
  },
};

export const Main: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas).toBeTruthy();
  },
  args: {
    stage: "main",
  },
};
