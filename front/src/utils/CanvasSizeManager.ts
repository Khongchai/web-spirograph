/**
 * Add an integer to simpleSeed everytime increment is called.
 *
 * Have to do this because webpack5 doesn't support polyfills :(
 */
export abstract class SimpleIdGenerator {
  simpleSeed: string;
  count: number;

  constructor(simpleSeed: string) {
    this.simpleSeed = simpleSeed;
    this.count = 0;
  }

  getId() {
    const newId = this.simpleSeed + this.count;
    this.count++;

    return newId;
  }

  resetId() {
    this.count = 0;
  }
}

class CanvasSizeManager extends SimpleIdGenerator {
  constructor(simpleIdSeed: string) {
    super(simpleIdSeed);
  }

  private canvasAndListenerCallbackMap: Record<
    string,
    VoidFunction | undefined
  > = {};
  private mainThreadCanvasAttributeName = "setCanvasSize-id";

  /**
   * Remove listener of all canvas that have been set up by this class.
   */
  clearListener() {
    for (const key in this.canvasAndListenerCallbackMap) {
      const callback = this.canvasAndListenerCallbackMap[key];
      this.canvasAndListenerCallbackMap[key] = undefined;
      window.removeEventListener("resize", callback!);
    }

    this.resetId();
  }

  setCanvasSize(
    // We just need this to set the HTML attribute, so passing in
    // canvases that have moved their controls to offscreen is fine.
    canvas: HTMLCanvasElement,
    resizeCallback: VoidFunction,
    withResizeListener: boolean
  ) {
    const listenerCallback = resizeCallback;
    resizeCallback();

    if (withResizeListener) {
      window.addEventListener("resize", listenerCallback);

      canvas.setAttribute(this.mainThreadCanvasAttributeName, this.getId());

      this.canvasAndListenerCallbackMap[
        canvas.getAttribute(this.mainThreadCanvasAttributeName)!
      ] = listenerCallback;
    }
  }
}

export class CanvasSizeManagers {
  static mainThreadCanvasSizeManager = new CanvasSizeManager(
    "mainThreadCanvasSizeManager"
  );
  static particlesWorkerCanvasSizeManager = new CanvasSizeManager(
    "particlesWorkerCanvasSizeManager"
  );
  static instantDrawerCanvasSizeManager = new CanvasSizeManager(
    "instantDrawerCanvasSizeManager"
  );
}
