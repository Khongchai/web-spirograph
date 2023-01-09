import { Vector2 } from "../../../classes/DTOInterfaces/vector2";
import InstantDrawCycloid from "./Cycloid";

export interface DrawerData {
  cycloids: InstantDrawCycloid[];
  theta: number;
  gl: WebGL2RenderingContext;
  canvas: OffscreenCanvas;
  timeStepScalar: number;
  initialTransform: { x: number; y: number; z: number };
  devicePixelRatio: number;
}
