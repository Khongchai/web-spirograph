import type { Meta, StoryObj } from "@storybook/react";

import BackgroundParticles from "../pages/BackgroundParticles";
import { within } from "@testing-library/react";
import { expect } from "@storybook/jest";
import InstantCanvas from "../components/main/Canvas/Instant";
import colors from "../constants/colors";
import CycloidControls from "../classes/domain/cycloidControls";
import BoundingCircle from "../classes/domain/BoundingCircle";
import * as React from "react";

const meta: Meta<typeof InstantCanvas> = {
  title: "Instant Canvas",
  component: InstantCanvas,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof InstantCanvas>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-screen h-screen bg-purple-dark">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas).toBeTruthy();
    expect(false).toBeTruthy(); // fail on purpose.
  },
  args: {
    cycloidControls: {
      current: new CycloidControls({
        outermostBoundingCircle: new BoundingCircle(
          {
            // These initial values will be eventually overwritten.
            x: 0,
            y: 0,
          },
          400,
          colors.purple.light
        ),
        cycloids: [
          {
            rodLengthScale: 0.5,
            rotationDirection: "counterclockwise",
            radius: 120,
            animationSpeedScale: 0.69,
            moveOutSideOfParent: true,
            boundingColor: colors.purple.light,
          },
          {
            rodLengthScale: 0.8,
            rotationDirection: "counterclockwise",
            radius: 100,
            animationSpeedScale: 1,
            moveOutSideOfParent: true,
            boundingColor: colors.purple.light,
          },
          {
            rodLengthScale: 0.86,
            rotationDirection: "clockwise",
            radius: 123.51,
            animationSpeedScale: 1,
            moveOutSideOfParent: true,
            boundingColor: colors.purple.light,
          },
        ],
        globalTimeStepScale: 6.6,
        currentCycloidId: 2,
        mode: "Animated",
        scaffold: "Showing",
        animationState: "Playing",
        clearTracedPathOnParamsChange: true,
        traceAllCycloids: false,
        showAllCycloids: true,
        programOnly: {
          tracePath: true,
        },
      }),
    },
    pointsAmount: 10000,
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};

function Wrapper(args: React.ComponentProps<typeof InstantCanvas>) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={parentRef}
      style={{
        backgroundColor: "black",
        height: "100vh",
        width: "100vw",
      }}
    >
      <InstantCanvas {...args} parent={parentRef} />;
    </div>
  );
}
