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
import { DrawerData } from "./models/DrawerData";

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
  extends InstantDrawerEpitrochoidRenderer
  implements EventHandler, MessageHandler
{
  private _drawerData?: DrawerData;
  private _cachedImageData: CachedImageData;

  private _zoomThrottler: Throttler;
  private _resizeThrottler: Throttler;
  private _setParametersThrottler: Throttler;

  constructor() {
    super();

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
    this._cachedImageData.image =
      this._drawerData!.canvas.convertToBlob().then(createImageBitmap);
    this._cachedImageData.imageTranslation = this._drawerData!.translation;
    if (zoomLevel) this._cachedImageData.imageZoomLevel = zoomLevel;
  }

  _onResize({ payload }: { payload: SetCanvasSizePayload }): void {
    const { canvasHeight, canvasWidth } = payload;

    this._resizeThrottler.throttle(() => {
      if (!this._drawerData) {
        throw new Error("Call initializeDrawer first");
      }

      this._drawerData!.canvas.width = canvasWidth;
      this._drawerData!.canvas.height = canvasHeight;
      CanvasTransformUtils.clear(
        this._drawerData!.ctx,
        canvasWidth,
        canvasHeight
      );

      super.render(this._drawerData);
      this._computeImage({});
    }, 200);
  }

  _onInit({ payload }: { payload: InitializeDrawerPayload }): void {
    const {
      canvas,
      canvasHeight,
      canvasWidth,
      cycloids,
      initialTheta,
      pointsAmount,
      timeStepScalar,
      translation,
    } = payload;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d")!;

    this._drawerData = {
      canvas,
      ctx,
      cycloids: cycloids,
      pointsAmount,
      theta: initialTheta,
      timeStepScalar,
      translation: translation ?? { x: 0, y: 0 },
    };

    super.render(this._drawerData);
    this._computeImage({});
  }

  _onZoom({ payload }: { payload: ZoomPayload }): void {
    const { ctx, canvas } = this._drawerData!;
    const {
      zoomData: { mouseCurrentPos, zoomLevel },
    } = payload!;

    this._cachedImageData.image?.then((image) => {
      CanvasTransformUtils.clear(ctx, canvas.width, canvas.height);

      const previousTranslation = this._cachedImageData.imageTranslation ?? {
        x: 0,
        y: 0,
      };
      const zoomCenter = {
        x: canvas.width / 2 + previousTranslation.x,
        y: canvas.height / 2 + previousTranslation.y,
      };
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(zoomCenter.x, zoomCenter.y);
      const prevTransform = ctx.getTransform();
      const compensatedZoomLevel =
        zoomLevel / (this._cachedImageData.imageZoomLevel ?? 1);
      ctx.setTransform(
        compensatedZoomLevel,
        0,
        0,
        compensatedZoomLevel,
        prevTransform.e,
        prevTransform.f
      );
      ctx.translate(-zoomCenter.x, -zoomCenter.y);
      ctx.drawImage(image, 0, 0);
      ctx.restore();

      this._zoomThrottler.throttle(() => {
        //TODO
        // ctx.translate(mouseCurrentPos.x, mouseCurrentPos.y);
        ctx.setTransform(zoomLevel, 0, 0, zoomLevel, 0, 0);
        // ctx.translate(-mouseCurrentPos.x, -mouseCurrentPos.y);

        super.render(this._drawerData!);

        this._computeImage({
          zoomLevel,
        });
      }, 300);
    });
  }

  _onPan({ payload }: { payload: PanPayload }): void {
    const { panState } = payload!;

    if (panState.mouseState == "mouseup") {
      super.render(this._drawerData!);
      this._computeImage({});

      return;
    }

    const { ctx, canvas } = this._drawerData!;
    this._drawerData!.translation = {
      x: panState.newCanvasPos.x,
      y: panState.newCanvasPos.y,
    };

    this._cachedImageData.image?.then((image) => {
      const previousTranslation = this._cachedImageData.imageTranslation;

      const translateX =
        panState.newCanvasPos.x - (previousTranslation?.x ?? 0);
      const translateY =
        panState.newCanvasPos.y - (previousTranslation?.y ?? 0);

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      //TODO if the pan starts right after zoom, the image prior to the scale translation
      // will be shown. We should also apply the zoom translation here.
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, translateX, translateY);
      ctx.drawImage(image, 0, 0);
      ctx.restore();
    });
  }

  _onParamChanged({ payload }: { payload: SetParametersPayload }): void {
    this._setParametersThrottler.throttle(() => {
      Object.assign(this._drawerData!, payload);

      super.render(this._drawerData!);
      this._computeImage({});
    }, 100);
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
