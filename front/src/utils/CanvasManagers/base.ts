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

export interface BaseCanvasEventManager {
  clearListener: VoidFunction;
  addOnEventCallback: ({
    call,
    elementToAttachEventListener,
    eventCallback,
  }: {
    call: "once" | "onEvent" | "onceAndOnEvent";
    elementToAttachEventListener: HTMLElement | (Window & typeof globalThis);

    eventCallback: VoidFunction;
  }) => void;
}

export class CanvasManager
  extends SimpleIdGenerator
  implements BaseCanvasEventManager
{
  private forEvent: keyof WindowEventMap;
  protected canvasName = "setCanvasSize-id";

  constructor(
    simpleSeed: string,
    { forEvent }: { forEvent: keyof WindowEventMap }
  ) {
    super(simpleSeed);

    this.forEvent = forEvent;
  }

  protected callbacksAndListener: {
    callback: VoidFunction;
    target: HTMLElement | (Window & typeof globalThis);
  }[] = [];

  /**
   * Remove listener of all canvas that have been set up by this class.
   */
  clearListener() {
    for (const elem of this.callbacksAndListener) {
      elem.target.removeEventListener(this.forEvent, elem.callback);
    }

    this.callbacksAndListener = [];
    this.resetId();
  }

  addOnEventCallback(
    /**
     *  We just need this to set the HTML attribute, so passing in
     *  canvases that have moved their controls to offscreen is fine.
     **/
    {
      call,
      elementToAttachEventListener,
      eventCallback,
    }: {
      call: "once" | "onEvent" | "onceAndOnEvent";
      elementToAttachEventListener?: HTMLElement | (Window & typeof globalThis);
      eventCallback: (e?: Event) => void;
    }
  ) {
    if (["once", "onceAndOnEvent"].includes(call)) eventCallback();

    if (["onEvent", "onceAndOnEvent"].includes(call)) {
      const target = elementToAttachEventListener ?? window;
      target.addEventListener(this.forEvent, eventCallback, { passive: false });

      this.callbacksAndListener.push({
        callback: eventCallback,
        target: target,
      });
    }
  }
}
