import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import MousePos from "./models/MousePos";
import RepellerData from "./models/RepellerData";
import ScreenSize from "./models/ScreenSize";
import ParticlesWorkerPayload, {
  ParticlesWorkerOperation,
} from "./particlesWorkerPayloads";
import drawParticles from "./utils/drawParticles/drawParticles";

// Global objects to be referenced until the worker dies.
const screenSize: ScreenSize = {
  width: 0,
  height: 0,
};
const mousePos: MousePos = {
  x: -999999,
  y: -999999,
};
const repellerData: RepellerData = {
  beginLerping: 0,
  repellerCurrentSize: 0,
  desiredRepellerSize: 0,
  lerpWeight: 0,
  currentRotationAngle: 0,
};
const screenCenter: Vector2 = {
  x: 0,
  y: 0,
};
let canvasReference: OffscreenCanvas;
let canvasContextReference: OffscreenCanvasRenderingContext2D;

/**
 *
 * Docs:
 *
 * main thread => (payload & operation) as message => onmessage (like a mapper) => worker thread
 */
onmessage = ({ data }: { data: ParticlesWorkerPayload }) => {
  switch (data.operation) {
    case ParticlesWorkerOperation.Init: {
      const {
        canvas,
        canvasHeight: height,
        canvasWidth: width,
      } = data.initPayload!;
      canvasReference = canvas;
      canvas.height = height;
      canvas.width = width;
      screenSize.width = width;
      screenSize.height = height;

      canvasContextReference = canvas.getContext("2d")!;

      drawParticles({
        ctx: canvasContextReference,
        mousePos,
        screenSize,
        repellerData,
        screenCenter,
      });
      break;
    }

    case ParticlesWorkerOperation.SetMousePos: {
      const { height, width } = screenSize;
      const { x, y } = data.setMousePosPayload!;
      mousePos.x = x - width / 2;
      mousePos.y = y - height / 2;
      break;
    }

    case ParticlesWorkerOperation.SpreadAndRotate: {
      const { action, repellerSize, repellerWeight } =
        data.spreadAndRotatePayload!;

      repellerData.beginLerping = action === "shrink" ? 0 : 1;
      repellerData.desiredRepellerSize = repellerSize;
      repellerData.lerpWeight = repellerWeight;

      break;
    }

    case ParticlesWorkerOperation.Resize: {
      const { newWidth, newHeight } = data.resizePayload!;

      screenSize.width = newWidth;
      screenSize.height = newHeight;
      canvasReference.width = newWidth;
      canvasReference.height = newHeight;
      canvasContextReference.translate(newWidth / 2, newHeight / 2);

      break;
    }
  }
};
