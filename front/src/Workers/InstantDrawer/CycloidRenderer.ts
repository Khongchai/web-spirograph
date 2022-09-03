import { Throttler } from "../../utils/throttler";
import {
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
} from "./instantDrawerWorkerPayloads";
import { CachedImageData } from "./models/CachedImageData";
import { DrawerData } from "./models/DrawerData";

interface CycloidRenderer {
  _render(): void;
  _onResize(): void;
  _onInit(): void;
  _onZoom(): void;
  _onPan(): void;
  _onParamChanged(): void;
}

interface MessageHandler {
  handleOnMessage({ data }: { data: InstantDrawerWorkerPayload }): void;
}

export class InstantDrawerWorkerRenderer
  implements CycloidRenderer, MessageHandler
{
  drawerData?: DrawerData;
  cachedImageData: CachedImageData;

  private _zoomThrottler: Throttler;
  private _panThrottler: Throttler;
  private _setParametersThrottler: Throttler;

  constructor() {
    this.cachedImageData = {
      image: undefined,
      imageTranslation: {
        x: 0,
        y: 0,
      },
      imageZoomLevel: 1,
    };

    this._zoomThrottler = new Throttler();
    this._panThrottler = new Throttler();
    this._setParametersThrottler = new Throttler();
  }

  _render(): void {
    throw new Error("Method not implemented.");
  }

  _onResize(): void {
    throw new Error("Method not implemented.");
  }

  _onInit(): void {
    throw new Error("Method not implemented.");
  }

  _onZoom(): void {
    throw new Error("Method not implemented.");
  }

  _onPan(): void {
    throw new Error("Method not implemented.");
  }

  _onParamChanged(): void {
    throw new Error("Method not implemented.");
  }

  handleOnMessage({ data }: { data: InstantDrawerWorkerPayload }) {
    switch (data.operation) {
      case InstantDrawerWorkerOperations.initializeDrawer:
        this._onInit();
        return;
      case InstantDrawerWorkerOperations.setParameters:
        this._onParamChanged();
        return;
      case InstantDrawerWorkerOperations.pan:
        this._onResize();
        return;
      case InstantDrawerWorkerOperations.zoom:
        this._onZoom();
        return;
      case InstantDrawerWorkerOperations.setCanvasSize:
        this._onResize();
        return;
    }
  }
}
