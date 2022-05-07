import { Vector2 } from "../../classes/vector2";
import drawParticles from "./utils/drawParticles/drawParticles";
import RepellerData from "./models/RepellerData";
import MousePos from "./models/MousePos";
import RotationAngles from "./models/RotationAngles";
import ScreenSize from "./models/ScreenSize";
import ParticlesWorkerPayload, { ParticlesWorkerOperation } from "./payloads";

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
      canvas.height = height;
      canvas.width = width;
      screenSize.width = width;
      screenSize.height = height;

      const ctx = canvas.getContext("2d")!;

      drawParticles({
        ctx,
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
      //TODO figure out later why this shit doesn't work.
      break;
      const { newWidth, newHeight } = data.resizePayload!;
      screenSize.width = newWidth;
      screenSize.height = newHeight;

      break;
    }
  }
};
