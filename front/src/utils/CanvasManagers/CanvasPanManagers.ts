import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import { BaseCanvasEventManager, CanvasManager } from "./base";

export type CanvasPanState = {
  newCanvasPos: Vector2;
  mouseState: "mousedown" | "mouseup";
};

class CanvasPanManager implements BaseCanvasEventManager {
  private _mouseDownPos: Vector2 = { x: 0, y: 0 };
  private _canvasTranslatedPosition: Vector2 = { x: 0, y: 0 };
  private _mouseDown = false;

  private _mouseMoveManager = new CanvasManager(
    "canvas-pan-mouse-move-manager",
    {
      forEvent: "mousemove",
    }
  );
  private _mouseUpManager = new CanvasManager("canvas-pan-mouse-up-manager", {
    forEvent: "mouseup",
  });
  private _mouseDownManager = new CanvasManager(
    "canvas-pan-mouse-down-manager",
    {
      forEvent: "mousedown",
    }
  );
  private _panState: CanvasPanState = {
    newCanvasPos: { x: 0, y: 0 },
    mouseState: "mouseup",
  };
  /**
   * Event will trigger when mouse moves only.
   */
  addOnEventCallback({
    call,
    elementToAttachEventListener,
    eventCallback,
  }: {
    call: "once" | "onEvent" | "onceAndOnEvent";
    elementToAttachEventListener: HTMLElement | (Window & typeof globalThis);
    eventCallback: (canvasPanState: CanvasPanState) => void;
  }) {
    this._mouseMoveManager.addOnEventCallback({
      call,
      elementToAttachEventListener,
      eventCallback: (e?) => {
        const castedE = e as MouseEvent;
        if (!this._mouseDown) return;

        castedE.preventDefault();
        const newMousePos = this._getMousePositionMoved({
          x: castedE.x,
          y: castedE.y,
        });
        const newCanvasPos = this._getTranslatedCanvasPosition(newMousePos);
        this._panState.newCanvasPos = newCanvasPos;

        eventCallback(this._panState);
      },
    });
    this._mouseDownManager.addOnEventCallback({
      call,
      elementToAttachEventListener,
      eventCallback: (e?) => {
        const castedE = e as MouseEvent;
        const leftMouseButton = 0;
        if (castedE!.button !== leftMouseButton) return;

        this._mouseDownPos.x = castedE.clientX;
        this._mouseDownPos.y = castedE.clientY;
        this._mouseDown = true;
        this._panState.mouseState = "mousedown";

        eventCallback(this._panState);
      },
    });
    this._mouseUpManager.addOnEventCallback({
      call,
      elementToAttachEventListener,
      eventCallback: (e?) => {
        const castedE = e as MouseEvent;
        if (this._mouseDown) {
          const newMousePos = this._getMousePositionMoved({
            x: castedE.x,
            y: castedE.y,
          });
          const newCanvasPos = this._getTranslatedCanvasPosition(newMousePos);
          this._canvasTranslatedPosition.x = newCanvasPos.x;
          this._canvasTranslatedPosition.y = newCanvasPos.y;

          this._mouseDown = false;
          this._panState.mouseState = "mouseup";

          eventCallback(this._panState);
        }
      },
    });
  }

  clearListener(): void {
    this._mouseMoveManager.clearListener();
    this._mouseDownManager.clearListener();
    this._mouseUpManager.clearListener();
  }

  getTranslation(): Vector2 {
    return {
      x: this._canvasTranslatedPosition.x,
      y: this._canvasTranslatedPosition.y,
    };
  }

  private _getMousePositionMoved(pos: Vector2): Vector2 {
    const mouseMovePos: Vector2 = {
      x: pos.x - this._mouseDownPos.x,
      y: pos.y - this._mouseDownPos.y,
    };
    const newPos: Vector2 = {
      x: mouseMovePos.x,
      y: mouseMovePos.y,
    };
    return newPos;
  }

  private _getTranslatedCanvasPosition(pos: Vector2): Vector2 {
    const newPos: Vector2 = {
      x: this._canvasTranslatedPosition.x + pos.x,
      y: this._canvasTranslatedPosition.y + pos.y,
    };
    return newPos;
  }
}

export class CanvasPanManagers {
  static mainThread = new CanvasPanManager();
  static instantDrawerWorkerThread = new CanvasPanManager();
}
