import { CanvasTransformUtils } from "../../utils/CanvasTransformsUtils";
import { Throttler } from "../../utils/throttler";
import { InstantDrawerEpitrochoidRenderer } from "./InstantDrawerWorkerEpitrochoidRenderer";
import {
  InitializeDrawerPayload,
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
  PanPayload,
  SetCanvasSizePayload,
  SetParametersPayload,
  ZoomPayload,
} from "./instantDrawerWorkerPayloads";
import { CachedImageData } from "./models/CachedImageData";

interface EventHandler {
  _onResize({ payload }: { payload: SetCanvasSizePayload }): void;
  _onInit({ payload }: { payload: InitializeDrawerPayload }): void;
  _onZoom({ payload }: { payload: ZoomPayload }): void;
  _onPan({ payload }: { payload: PanPayload }): void;
  _onParamChanged({ payload }: { payload: SetParametersPayload }): void;
}

interface MessageHandler {
  handleOnMessage({ data }: { data: InstantDrawerWorkerPayload }): void;
}

export class InstantDrawerWorkerMessageHandler
  implements EventHandler, MessageHandler
{
  private renderer: InstantDrawerEpitrochoidRenderer;

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
      translation,
      devicePixelRatio,
    } = payload;

    const gl = canvas.getContext("webgl2")!;

    this.renderer = new InstantDrawerEpitrochoidRenderer(
      { x: canvasWidth, y: canvasHeight },
      {
        canvas,
        gl,
        cycloids: cycloids,
        theta: initialTheta,
        timeStepScalar,
        translation: translation ?? { x: 0, y: 0 },
        devicePixelRatio,
      }
    );

    this.renderer.render();
    // this._computeImage({});
  }

  _onZoom({ payload }: { payload: ZoomPayload }): void {
    // const { ctx, canvas } = this.drawerData!;
    // const {
    //   zoomData: { mouseCurrentPos, zoomLevel },
    // } = payload!;
    // this._cachedImageData.image?.then((image) => {
    //   CanvasTransformUtils.clear(ctx, canvas.width, canvas.height);
    //   const previousTranslation = this._cachedImageData.imageTranslation ?? {
    //     x: 0,
    //     y: 0,
    //   };
    //   const zoomCenter = {
    //     x: canvas.width / 2 + previousTranslation.x,
    //     y: canvas.height / 2 + previousTranslation.y,
    //   };
    //   ctx.save();
    //   ctx.setTransform(1, 0, 0, 1, 0, 0);
    //   ctx.translate(zoomCenter.x, zoomCenter.y);
    //   const prevTransform = ctx.getTransform();
    //   const compensatedZoomLevel =
    //     zoomLevel / (this._cachedImageData.imageZoomLevel ?? 1);
    //   ctx.setTransform(
    //     compensatedZoomLevel,
    //     0,
    //     0,
    //     compensatedZoomLevel,
    //     prevTransform.e,
    //     prevTransform.f
    //   );
    //   ctx.translate(-zoomCenter.x, -zoomCenter.y);
    //   ctx.drawImage(image, 0, 0);
    //   ctx.restore();
    //   this._zoomThrottler.throttle(async () => {
    //     //TODO
    //     // ctx.translate(mouseCurrentPos.x, mouseCurrentPos.y);
    //     ctx.setTransform(zoomLevel, 0, 0, zoomLevel, 0, 0);
    //     // ctx.translate(-mouseCurrentPos.x, -mouseCurrentPos.y);
    //     await super.render();
    //     this._computeImage({
    //       zoomLevel,
    //     });
    //   }, 200);
    // });
  }

  async _onPan({ payload }: { payload: PanPayload }): Promise<void> {
    // const { panState } = payload!;
    // if (panState.mouseState == "mouseup") {
    //   await super.render();
    //   this._computeImage({});
    //   return;
    // }
    // const { ctx, canvas } = this.drawerData!;
    // this.drawerData!.translation = {
    //   x: panState.newCanvasPos.x,
    //   y: panState.newCanvasPos.y,
    // };
    // this._cachedImageData.image?.then((image) => {
    //   const previousTranslation = this._cachedImageData.imageTranslation;
    //   const translateX =
    //     panState.newCanvasPos.x - (previousTranslation?.x ?? 0);
    //   const translateY =
    //     panState.newCanvasPos.y - (previousTranslation?.y ?? 0);
    //   ctx.save();
    //   ctx.setTransform(1, 0, 0, 1, 0, 0);
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   ctx.restore();
    //   //TODO if the pan starts right after zoom, the image prior to the scale translation
    //   // will be shown. We should also apply the zoom translation here.
    //   ctx.save();
    //   ctx.setTransform(1, 0, 0, 1, translateX, translateY);
    //   ctx.drawImage(image, 0, 0);
    //   ctx.restore();
    // });
  }

  _onParamChanged({ payload }: { payload: SetParametersPayload }) {
    const then = performance.now();
    this._setParametersThrottler.throttle(async () => {
      Object.assign(this.renderer.drawerData!, payload);

      await this.renderer.render();
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
      case InstantDrawerWorkerOperations.pan:
        this._onPan({ payload: data.panPayload! });
        return;
      case InstantDrawerWorkerOperations.zoom:
        this._onZoom({ payload: data.zoomPayload! });
        return;
      case InstantDrawerWorkerOperations.setCanvasSize:
        this._onResize({ payload: data.setCanvasSizePayload! });
        return;
    }
  }
}
