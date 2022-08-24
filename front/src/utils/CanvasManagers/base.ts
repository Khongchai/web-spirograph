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

interface BaseCanvasEventManager {
  clearListener: VoidFunction;
  onEvent: ({
    call,
    canvas,
    eventCallback,
  }: {
    call: "once" | "onEvent" | "onceAndOnEvent";
    canvas: HTMLCanvasElement;
    eventCallback: VoidFunction;
  }) => void;
}

export class CanvasManager
  extends SimpleIdGenerator
  implements BaseCanvasEventManager
{
  private forEvent: keyof WindowEventMap;
  protected mainThreadCanvasAttributeName = "setCanvasSize-id";

  constructor(
    simpleSeed: string,
    { forEvent }: { forEvent: keyof WindowEventMap }
  ) {
    super(simpleSeed);

    this.forEvent = forEvent;
  }

  protected canvasAndListenerCallbackMap: Record<
    string,
    VoidFunction | undefined
  > = {};

  /**
   * Remove listener of all canvas that have been set up by this class.
   */
  clearListener() {
    for (const key in this.canvasAndListenerCallbackMap) {
      const callback = this.canvasAndListenerCallbackMap[key];
      this.canvasAndListenerCallbackMap[key] = undefined;

      window.removeEventListener(this.forEvent, callback!);
    }

    this.resetId();
  }

  onEvent(
    /**
     *  We just need this to set the HTML attribute, so passing in
     *  canvases that have moved their controls to offscreen is fine.
     **/
    {
      call,
      canvas,
      eventCallback,
    }: {
      call: "once" | "onEvent" | "onceAndOnEvent";
      canvas: HTMLCanvasElement;
      eventCallback: VoidFunction;
    }
  ) {
    eventCallback();
    if (["once", "onceAndOnEvent"].includes(call)) eventCallback();

    if (["onEvent", "onceAndOnEvent"].includes(call)) {
      window.addEventListener(this.forEvent, eventCallback);

      canvas.setAttribute(this.mainThreadCanvasAttributeName, this.getId());

      this.canvasAndListenerCallbackMap[
        canvas.getAttribute(this.mainThreadCanvasAttributeName)!
      ] = eventCallback;
    }
  }
}
