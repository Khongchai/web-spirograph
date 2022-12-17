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
    zoomLevel: number,
    { debug = false }: { debug: boolean }
  ) {
    // 0. let zoom coordinates && let zoom level.
    // 1. Get current matrix from the ctx.
    // 2. Apply the transformation matrix to the new zoom coordinates.
    // 3. Apply the new zoomLevel at the new zoom coordinates.

    // Describe the cursor matrix as the matrix of the screen.
    const cursorMatrix = new DOMMatrix([
      1,
      0,
      0,
      1,
      zoomCenter.x * devicePixelRatio,
      zoomCenter.y * devicePixelRatio,
    ]);
    const currentMatrix = ctx.getTransform();
    // Transformed the cursor in screen space to the canvas's space.
    cursorMatrix.multiply(currentMatrix);

    ctx.setTransform(currentMatrix.multiply(cursorMatrix));

    if (debug) {
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.arc(cursorMatrix.e, cursorMatrix.f, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // const previousMatrix = ctx.getTransform();
    // // zoomX and zoomY are in screen coordinates.
    // const cursorMatrix = new DOMMatrix([
    //   1,
    //   0,
    //   0,
    //   1,
    //   zoomCenter.x - previousMatrix.e,
    //   zoomCenter.y - previousMatrix.f,
    // ]);
    // const transformedZoom = cursorMatrix.multiply(previousMatrix);

    // const zoomX = transformedZoom.e * devicePixelRatio;
    // const zoomY = transformedZoom.f * devicePixelRatio;

    // ctx.translate(zoomX, zoomY);
    // const prevTransform = ctx.getTransform();
    // ctx.setTransform(
    //   zoomLevel,
    //   0,
    //   0,
    //   zoomLevel,
    //   prevTransform.e,
    //   prevTransform.f
    // );
    // ctx.translate(-zoomX, -zoomY);
  }
}
