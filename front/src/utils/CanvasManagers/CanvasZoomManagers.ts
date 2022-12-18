import { createTextChangeRange } from "typescript";
import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import { BaseCanvasEventManager, CanvasManager } from "./base";

export interface ZoomData {
  mouseCurrentPos: Vector2;
  // The 1st derivative of zoomLevel.
  change: number;
  zoomLevel: number;
}

export class CanvasZoomManager implements BaseCanvasEventManager {
  private _mouseWheelManager = new CanvasManager({
    forEvent: "wheel",
  });
  private _mouseMoveManager = new CanvasManager({
    forEvent: "mousemove",
  });
  private _zoomData: ZoomData = {
    mouseCurrentPos: { x: 0, y: 0 },
    change: 0,
    zoomLevel: 1,
  };

  constructor({ initialZoomLevel }: { initialZoomLevel: number }) {
    this._zoomData.zoomLevel = initialZoomLevel;
  }

  addOnEventCallback({
    call,
    elementToAttachEventListener,
    eventCallback,
  }: {
    call: "once" | "onEvent" | "onceAndOnEvent";
    elementToAttachEventListener?:
      | HTMLElement
      | (Window & typeof globalThis)
      | undefined;
    eventCallback: (zoomData: ZoomData) => void;
  }): void {
    this._mouseWheelManager.addOnEventCallback({
      call,
      elementToAttachEventListener,
      eventCallback: (e: WheelEvent) => {
        e.preventDefault();

        let newZoomLevel = this._zoomData.zoomLevel;
        const sign = Math.sign(e.deltaY);

        newZoomLevel = Math.max(newZoomLevel - e.deltaY * 0.00035, 0.1);
        const change =
          Math.log10(Math.max(1, this._zoomData.zoomLevel)) * -sign;
        newZoomLevel += change;
        this._zoomData.zoomLevel = newZoomLevel;
        this._zoomData.change = change;

        eventCallback(this._zoomData);
      },
    });

    this._mouseMoveManager.addOnEventCallback({
      call,
      elementToAttachEventListener,
      eventCallback: (e: MouseEvent) => {
        this._zoomData.mouseCurrentPos.x = e.x;
        this._zoomData.mouseCurrentPos.y = e.y;
      },
    });
  }

  clearAllListeners() {
    this._mouseMoveManager.clearAllListeners();
    this._mouseWheelManager.clearAllListeners();
  }
}

export class CanvasZoomManagers {
  private static zoomLevel = 1;

  static mainThread = new CanvasZoomManager({
    initialZoomLevel: CanvasZoomManagers.zoomLevel,
  });
  static instantDrawerWorkerThread = new CanvasZoomManager({
    initialZoomLevel: CanvasZoomManagers.zoomLevel,
  });
}
