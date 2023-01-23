import { InstantDrawerEpitrochoidRenderer } from "./InstantDrawerWorkerEpitrochoidRenderer";
import {
  InitializeDrawerPayload,
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
  SetCanvasSizePayload,
  SetParametersPayload,
  TransformPayload,
} from "./instantDrawerWorkerPayloads";

interface EventHandler {
  onResize({ payload }: { payload: SetCanvasSizePayload }): void;
  onInit({ payload }: { payload: InitializeDrawerPayload }): void;
  onTransform({ payload }: { payload: TransformPayload }): void;
  onParamChanged({ payload }: { payload: SetParametersPayload }): void;
}

interface MessageHandler {
  handleOnMessage({ data }: { data: InstantDrawerWorkerPayload }): void;
}

export class InstantDrawerWorkerMessageHandler
  implements EventHandler, MessageHandler
{
  private _renderer: InstantDrawerEpitrochoidRenderer;

  async onResize({
    payload,
  }: {
    payload: SetCanvasSizePayload;
  }): Promise<void> {
    const { canvasHeight, canvasWidth, devicePixelRatio } = payload;
    this._renderer.resize(canvasWidth, canvasHeight, devicePixelRatio);
    await this._renderer.render();
  }

  async onInit({
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
  }

  async onTransform({ payload }: { payload: TransformPayload }): Promise<void> {
    this._renderer.setTransformation(payload!);
    await this._renderer.render();
  }

  async onParamChanged({
    payload,
  }: {
    payload: SetParametersPayload;
  }): Promise<OffscreenCanvas> {
    Object.assign(this._renderer.drawerData!, payload);

    return this._renderer.render();
  }

  handleOnMessage({ data }: { data: InstantDrawerWorkerPayload }) {
    switch (data.operation) {
      case InstantDrawerWorkerOperations.initializeDrawer:
        this.onInit({ payload: data.initializeDrawerPayload! });
        return;
      case InstantDrawerWorkerOperations.setParameters:
        this.onParamChanged({ payload: data.setParametersPayload! });
        return;
      case InstantDrawerWorkerOperations.transform:
        this.onTransform({ payload: data.transformPayload! });
        return;
      case InstantDrawerWorkerOperations.setCanvasSize:
        this.onResize({ payload: data.setCanvasSizePayload! });
        return;
    }
  }
}
