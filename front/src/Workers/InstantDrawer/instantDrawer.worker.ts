import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import {
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
} from "./instantDrawerWorkerPayloads";
import InstantDrawCycloid from "./models/Cycloid";
import beginDrawingEpitrochoid from "./utils/drawEpitrochoidResult";

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
 * We have to include the current information about the image's translation
 * so that we can offset that from our next pan translation as our translation value
 * does not get reset when this worker is re-created.
 *
 * So this is basically the data about the image in this worker's lifecycle.
 */
let cachedImageData: {
  image?: Promise<ImageBitmap>;
  imageTranslation?: Vector2;
} = {};

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

      // cachedImageData.image?.then((_) => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.restore();

      ctx.translate(mouseCurrentPos.x, mouseCurrentPos.y);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-mouseCurrentPos.x, -mouseCurrentPos.y);
      ctx.save();

      beginDrawingEpitrochoid(drawerData!);

      cachedImageData.image = drawerData.canvas
        .convertToBlob()
        .then(createImageBitmap);
      cachedImageData.imageTranslation = drawerData.translation;
      // });

      break;
    }
  }
};
