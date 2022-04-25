import BoundingCircle from "../../classes/BoundingCircle";
import Cycloid from "../../classes/Cycloid";
import CycloidControls from "../../classes/CycloidControls";
import { Vector2 } from "../../types/vector2";
import setCanvasSize from "./setCanvasSize";

export {};

interface args {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  cycloidControls: React.MutableRefObject<CycloidControls>;
  panRef: React.MutableRefObject<Vector2>;
  pointsToTrace: React.MutableRefObject<Vector2[]>;
  cycloidsRefForCanvas: React.MutableRefObject<Cycloid[]>;
  outermostBoundingCircle: BoundingCircle;
}

export function drawCycloid({
  canvas,
  cycloidControls,
  cycloidsRefForCanvas,
  height,
  width,
  outermostBoundingCircle,
  panRef,
  pointsToTrace,
}: args) {
  const ctx = canvas.getContext("2d")!;

  let dx = 0;

  setCanvasSize(canvas, width, height);

  const draw = () => {
    const curControls = cycloidControls.current;

    ctx.save();

    ctx.translate(panRef.current.x, panRef.current.y);
    ctx.lineWidth = 1.5;

    dx += curControls.animationSpeed;

    pointsToTrace.current = [];

    cycloidsRefForCanvas.current?.forEach((cycloid) => {
      const drawCurrentCycloid =
        curControls.showAllCycloids ||
        cycloid.getId() == curControls.currentCycloidId;

      // Keep updating the position even if the cycloid is not being drawn
      // This allows the child cycloids to be drawn in the correct position
      cycloid.setDx(dx);
      cycloid.move();

      if (drawCurrentCycloid) {
        //visual
        if (cycloidControls.current.scaffold === "Showing") {
          cycloid.showBounding(
            ctx,
            curControls.cycloidManager.getSingleCycloidParamFromId(
              cycloid.getId()
            )?.boundingColor
          );
          cycloid.showRod(ctx);
          cycloid.showPoint(ctx);

          // This one gets set multiple time but it's ok.
          outermostBoundingCircle.showBounding(ctx);
        }

        const pointPos = cycloid.getDrawPoint();
        pointsToTrace.current.push({ x: pointPos.x, y: pointPos.y });
      }
    });

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgba(43, 30, 57, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
    requestAnimationFrame(draw);
  };

  draw();
}
