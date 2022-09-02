import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import { CanvasTransformUtils } from "../../utils/CanvasTransformsUtils";
import { Throttler } from "../../utils/throttler";
import {
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
} from "./instantDrawerWorkerPayloads";
import InstantDrawCycloid from "./models/Cycloid";
import beginDrawingEpitrochoid from "./utils/drawEpitrochoidResult";
import { FunctionThrottler } from "./utils/functionThrottler";

//TODO this file needs a refactor.
//TODO all the convert to blob logic needs to be throttled.

export interface DrawerData {
  cycloids: InstantDrawCycloid[];
  theta: number;
  /**
   * Number of points to draw.
   *
   * More points = more processing time.
   */
  pointsAmount: number;
  ctx: OffscreenCanvasRenderingContext2D;
  canvas: OffscreenCanvas;
  canvasWidth: number;
  canvasHeight: number;
  timeStepScalar: number;
  translation: Vector2;
}

let drawerData: DrawerData | undefined;

/**
 * Creates a snapshot of the current image for panning.
 *
 * We have to include the current information about the image's translation and zoom
 * so that we can offset that from our transformation.
 */
let cachedImageData: {
  image?: Promise<ImageBitmap>;
  imageTranslation: Vector2;
  imageZoomLevel: number;
} = {
  image: undefined,
  imageTranslation: {
    x: 0,
    y: 0,
  },
  imageZoomLevel: 1,
};

const throttler = new Throttler();

onmessage = ({ data }: { data: InstantDrawerWorkerPayload }) => {
  switch (data.operation) {
    //Cache the current data as a bitmap, render that for subsequent frames
    // until panning stops.
    case InstantDrawerWorkerOperations.setParameters: {
      if (!drawerData) {
        throw new Error("Call initializeDrawer first");
      }

      Object.assign(drawerData, data.setParametersPayload);

      beginDrawingEpitrochoid(drawerData);

      cachedImageData.image = drawerData.canvas
        .convertToBlob()
        .then(createImageBitmap);
      cachedImageData.imageTranslation = drawerData.translation;

      break;
    }

    // 1. assign values to params
    // 2. begin canvas
    case InstantDrawerWorkerOperations.initializeDrawer: {
      const params = data.initializeDrawerPayload!;
      const {
        canvas,
        canvasHeight,
        canvasWidth,
        cycloids,
        initialTheta,
        pointsAmount,
        timeStepScalar,
        translation,
      } = params;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d")!;

      drawerData = {
        canvas,
        ctx,
        cycloids: cycloids,
        pointsAmount,
        theta: initialTheta,
        canvasHeight,
        canvasWidth,
        timeStepScalar,
        // Use the previous value if exists already.
        translation: translation ?? { x: 0, y: 0 },
      };

      beginDrawingEpitrochoid(drawerData);

      cachedImageData.image = drawerData.canvas
        .convertToBlob()
        .then(createImageBitmap);
      cachedImageData.imageTranslation = drawerData.translation;

      break;
    }

    case InstantDrawerWorkerOperations.pan: {
      if (!drawerData) {
        throw new Error("Call initializeDrawer first");
      }

      const { panState } = data.panPayload!;

      if (panState.mouseState == "mouseup") {
        beginDrawingEpitrochoid(drawerData);

        cachedImageData.image = drawerData.canvas
          .convertToBlob()
          .then(createImageBitmap);
        cachedImageData.imageTranslation = drawerData.translation;
        return;
      }

      const { canvasHeight, canvasWidth, ctx } = drawerData;
      drawerData!.translation = {
        x: panState.newCanvasPos.x,
        y: panState.newCanvasPos.y,
      };

      cachedImageData.image?.then((image) => {
        const previousTranslation = cachedImageData.imageTranslation;

        const translateX =
          panState.newCanvasPos.x - (previousTranslation?.x ?? 0);
        const translateY =
          panState.newCanvasPos.y - (previousTranslation?.y ?? 0);

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, translateX, translateY);
        ctx.drawImage(image, 0, 0);
        ctx.restore();
      });

      break;
    }

    case InstantDrawerWorkerOperations.zoom: {
      if (!drawerData) {
        throw new Error("Call initializeDrawer first");
      }

      const {
        zoomData: { mouseCurrentPos, zoomLevel },
      } = data.zoomPayload!;
      const { ctx, canvasWidth, canvasHeight } = drawerData;

      cachedImageData.image?.then((image) => {
        CanvasTransformUtils.clear(ctx, canvasWidth, canvasHeight);

        const previousTranslation = cachedImageData.imageTranslation ?? {
          x: 0,
          y: 0,
        };
        const zoomCenter = {
          x: canvasWidth / 2 + previousTranslation.x,
          y: canvasHeight / 2 + previousTranslation.y,
        };
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(zoomCenter.x, zoomCenter.y);
        const prevTransform = ctx.getTransform();
        const compensatedZoomLevel =
          zoomLevel / (cachedImageData.imageZoomLevel ?? 1);
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

        throttler.throttle(() => {
          // ctx.translate(mouseCurrentPos.x, mouseCurrentPos.y);
          ctx.setTransform(zoomLevel, 0, 0, zoomLevel, 0, 0);
          // ctx.translate(-mouseCurrentPos.x, -mouseCurrentPos.y);

          beginDrawingEpitrochoid(drawerData!);

          cachedImageData.image = drawerData!.canvas
            .convertToBlob()
            .then(createImageBitmap);
          cachedImageData.imageTranslation = drawerData!.translation;
          cachedImageData.imageZoomLevel = zoomLevel;
        }, 300);
      });

      break;
    }
  }
};
