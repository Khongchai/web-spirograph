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
        const delta = Math.max(-1, Math.min(1, e.deltaY));
        if (delta === 1) {
          this._zoomData.zoomLevel = Math.min(1.0, this._zoomData.zoomLevel);
          this._zoomData.zoomLevel -= 0.008;
        } else if (delta === -1) {
          this._zoomData.zoomLevel = Math.max(1.0, this._zoomData.zoomLevel);
          this._zoomData.zoomLevel += 0.008;
        }

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

  clearListener() {
    this._mouseMoveManager.clearListener();
    this._mouseWheelManager.clearListener();
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
