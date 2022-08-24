import { CanvasManager } from "./base";

class CanvasResizeManager extends CanvasManager {
  constructor(simpleSeed: string) {
    super(simpleSeed, {
      forEvent: "resize",
    });
  }
}

class CanvasMouseMove extends CanvasManager {
  constructor(simpleSeed: string) {
    super(simpleSeed, {
      forEvent: "mousemove",
    });
  }
}

export class CanvasSizeManagers {
  static mainThreadCanvasSizeManager = new CanvasResizeManager(
    "mainThreadCanvasSizeManager"
  );
  static particlesWorkerCanvasSizeManager = new CanvasResizeManager(
    "particlesWorkerCanvasSizeManager"
  );
  static instantDrawerCanvasSizeManager = new CanvasResizeManager(
    "instantDrawerCanvasSizeManager"
  );
}
