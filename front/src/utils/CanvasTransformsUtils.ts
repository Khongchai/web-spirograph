type Contexts = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/**
 * TODO: remove this
 */
export class CanvasTransformUtils {
  static clear(ctx: Contexts, width: number, height: number) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width * devicePixelRatio, height * devicePixelRatio);
    ctx.restore();
  }
}
