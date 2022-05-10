import { CycloidControlsProperties } from "../../../classes/cycloidControls";
import { Vector2 } from "../../../classes/vector2";

export default function generatePoints({
  cycloidControlsProperties,
  iterations,
  timeStep,
}: {
  cycloidControlsProperties: Partial<CycloidControlsProperties>;
  iterations: number;
  timeStep: number;
}): Vector2[] {
  //TODO => either generate points with a for loop or with equations.
  return [{ x: 0, y: 0 }];
}
