import { CanvasManager } from "./base";

class CanvasResizeManager extends CanvasManager {
  constructor(simpleSeed: string) {
    super(simpleSeed, {
      forEvent: "resize",
    });
  }
}

export class CanvasSizeManagers {
  static mainThread = new CanvasResizeManager("mainThreadCanvasSizeManager");
  static particlesWorkerThread = new CanvasResizeManager(
    "particlesWorkerCanvasSizeManager"
  );
  static instantDrawerWorkerThread = new CanvasResizeManager(
    "instantDrawerCanvasSizeManager"
  );
}
