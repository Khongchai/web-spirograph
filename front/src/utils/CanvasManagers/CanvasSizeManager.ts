import { CanvasManager } from "./base";

class CanvasResizeManager extends CanvasManager {
  constructor() {
    super({
      forEvent: "resize",
    });
  }
}

export class CanvasSizeManagers {
  static mainThread = new CanvasResizeManager();
  static particlesWorkerThread = new CanvasResizeManager();
  static instantDrawerWorkerThread = new CanvasResizeManager();
}
