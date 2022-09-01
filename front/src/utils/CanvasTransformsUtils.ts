import { Vector2 } from "../classes/DTOInterfaces/vector2";

type Contexts = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

// A better way would be to have the managers do this, but it's too late to go back now...
export class CanvasTransformUtils {
  static clear(ctx: Contexts, width: number, height: number) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
  }

  static zoom(ctx: Contexts, zoomCenter: Vector2, zoomLevel: number) {
    ctx.translate(zoomCenter.x, zoomCenter.y);
    const prevTransform = ctx.getTransform();
    ctx.setTransform(
      zoomLevel,
      0,
      0,
      zoomLevel,
      prevTransform.e,
      prevTransform.f
    );
    ctx.translate(-zoomCenter.x, -zoomCenter.y);
  }
}
