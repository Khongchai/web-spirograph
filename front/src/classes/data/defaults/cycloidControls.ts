import colors from "../../../constants/colors";
import BoundingCircle from "../../domain/BoundingCircle";
import CycloidControls from "../../domain/cycloidControls";

const defaultCycloidControls = new CycloidControls({
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
  globalTimeStepScale: 1,
  currentCycloidId: 2,
  mode: "Animated",
  scaffold: "Showing",
  animationState: "Playing",
  clearTracedPathOnParamsChange: true,
  traceAllCycloids: false,
  showAllCycloids: false,
  programOnly: {
    tracePath: true,
  },
});

export default defaultCycloidControls;
