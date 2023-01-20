import { Throttler } from "../../utils/throttler";
import { InstantDrawerEpitrochoidRenderer } from "./InstantDrawerWorkerEpitrochoidRenderer";
import {
  InitializeDrawerPayload,
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
  SetCanvasSizePayload,
  SetParametersPayload,
  TransformPayload,
} from "./instantDrawerWorkerPayloads";
import { CachedImageData } from "./models/CachedImageData";

interface EventHandler {
  _onResize({ payload }: { payload: SetCanvasSizePayload }): void;
  _onInit({ payload }: { payload: InitializeDrawerPayload }): void;
  _onTransform({ payload }: { payload: TransformPayload }): void;
  _onParamChanged({ payload }: { payload: SetParametersPayload }): void;
}

interface MessageHandler {
  handleOnMessage({ data }: { data: InstantDrawerWorkerPayload }): void;
}

export class InstantDrawerWorkerMessageHandler
  implements EventHandler, MessageHandler
{
  private _renderer: InstantDrawerEpitrochoidRenderer;

  private _cachedImageData: CachedImageData;

  private _zoomThrottler: Throttler;
  private _resizeThrottler: Throttler;
  private _setParametersThrottler: Throttler;

  constructor() {
    this._cachedImageData = {
      image: undefined,
      imageTranslation: {
        x: 0,
        y: 0,
      },
      imageZoomLevel: 1,
    };

    this._zoomThrottler = new Throttler();
    this._resizeThrottler = new Throttler();
    this._setParametersThrottler = new Throttler();
  }

  _computeImage({ zoomLevel }: { zoomLevel?: number }) {
    // this._cachedImageData.image =
    //   this.drawerData!.canvas.convertToBlob().then(createImageBitmap);
    // this._cachedImageData.imageTranslation = this.drawerData!.translation;
    // if (zoomLevel) this._cachedImageData.imageZoomLevel = zoomLevel;
  }

  _onResize({ payload }: { payload: SetCanvasSizePayload }): void {
    const { canvasHeight, canvasWidth } = payload;
    this._renderer.resize(canvasWidth, canvasHeight);
    this._renderer.render();
    // const { canvasHeight, canvasWidth } = payload;
    // this._resizeThrottler.throttle(async () => {
    //   if (!this.drawerData) {
    //     throw new Error("Call initializeDrawer first");
    //   }
    //   const transform = this.drawerData.ctx.getTransform();
    //   this.drawerData!.canvas.width = canvasWidth;
    //   this.drawerData!.canvas.height = canvasHeight;
    //   CanvasTransformUtils.clear(
    //     this.drawerData!.ctx,
    //     canvasWidth,
    //     canvasHeight
    //   );
    //   this.drawerData.ctx.setTransform(transform);
    //   await super.render();
    //   this._computeImage({});
    // }, 200);
  }

  async _onInit({
    payload,
  }: {
    payload: InitializeDrawerPayload;
  }): Promise<void> {
    const {
      canvas,
      canvasHeight,
      canvasWidth,
      cycloids,
      initialTheta,
      timeStepScalar,
      initialTransform,
      devicePixelRatio,
    } = payload;

    const gl = canvas.getContext("webgl2")!;

    this._renderer = new InstantDrawerEpitrochoidRenderer(
      { x: canvasWidth, y: canvasHeight },
      {
        canvas,
        gl,
        cycloids: cycloids,
        theta: initialTheta,
        timeStepScalar,
        initialTransform,
        devicePixelRatio,
      }
    );

    this._renderer.render();
    // this._computeImage({});
  }

  async _onTransform({
    payload,
  }: {
    payload: TransformPayload;
  }): Promise<void> {
    this._renderer.setTransformation(payload!);
    await this._renderer.render();
  }

  _onParamChanged({ payload }: { payload: SetParametersPayload }) {
    this._setParametersThrottler.throttle(async () => {
      Object.assign(this._renderer.drawerData!, payload);

      await this._renderer.render();
      this._computeImage({});
    }, 0);
  }

  handleOnMessage({ data }: { data: InstantDrawerWorkerPayload }) {
    switch (data.operation) {
      case InstantDrawerWorkerOperations.initializeDrawer:
        this._onInit({ payload: data.initializeDrawerPayload! });
        return;
      case InstantDrawerWorkerOperations.setParameters:
        this._onParamChanged({ payload: data.setParametersPayload! });
        return;
      case InstantDrawerWorkerOperations.transform:
        this._onTransform({ payload: data.transformPayload! });
        return;
      case InstantDrawerWorkerOperations.setCanvasSize:
        this._onResize({ payload: data.setCanvasSizePayload! });
        return;
    }
  }
}
