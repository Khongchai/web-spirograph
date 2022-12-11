import { createTextChangeRange } from "typescript";
import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import { BaseCanvasEventManager, CanvasManager } from "./base";

export interface ZoomData {
  mouseCurrentPos: Vector2;
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

        this._zoomData.zoomLevel = Math.max(
          this._zoomData.zoomLevel - e.deltaY * 0.00035,
          0.1
        );

        eventCallback(this._zoomData);
      },
    });

    // TODO mouse wheel hold and drag.

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
