/**
 * Add an integer to simpleSeed everytime increment is called.
 *
 * Have to do this because webpack5 doesn't support polyfills :(
 *
 * @deprecated This is unnecessary
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

/**
 * This can be used to create a composited event, like
 * "pan" (mousedown, mouseup, mousemove),
 * "zoom" (mousemove, wheel)
 * etc.
 *
 * To create a composited event, implements BaseCanvasEventManager and
 * within that class, define the needed event managers.
 */
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

export class CanvasManager implements BaseCanvasEventManager {
  private forEvent: keyof WindowEventMap;
  protected canvasName = "setCanvasSize-id";

  constructor({ forEvent }: { forEvent: keyof WindowEventMap }) {
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
      eventCallback: <T extends Event>(e?: T | any) => void;
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
