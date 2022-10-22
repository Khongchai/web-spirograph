import { Vector2 } from "../../../classes/DTOInterfaces/vector2";
import InstantDrawCycloid from "./Cycloid";

export interface DrawerData {
  cycloids: InstantDrawCycloid[];
  theta: number;
  ctx: OffscreenCanvasRenderingContext2D;
  canvas: OffscreenCanvas;
  timeStepScalar: number;
  translation: Vector2;
}
