import { createJsxText } from "typescript";
import { Vector2 } from "../classes/DTOInterfaces/vector2";

type Contexts = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

// A better way would be to have the managers do this, but it's too late to go back now...
export class CanvasTransformUtils {
  static clear(ctx: Contexts, width: number, height: number) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width * devicePixelRatio, height * devicePixelRatio);
    ctx.restore();
  }

  static zoom(
    ctx: Contexts,
    zoomCenter: Vector2,
    change: number,
    zoomLevel: number,
    { debug = false }: { debug: boolean }
  ) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const { x, y } = {
      x: zoomCenter.x * devicePixelRatio,
      y: zoomCenter.y * devicePixelRatio,
    };

    const currentTransform = ctx.getTransform();

    const wx = (x - currentTransform.e) / (width * zoomLevel);
    const wy = (y - currentTransform.f) / (height * zoomLevel);

    currentTransform.e -= wx * width * change;
    currentTransform.f -= wy * height * change;

    ctx.setTransform(currentTransform);

    if (debug) {
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.arc(currentTransform.e, currentTransform.f, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
