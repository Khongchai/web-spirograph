import drawParticles from "./drawParticles";
import CenterSpreadWeight from "./models/CenterSpreadWeight";
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
  x: 0,
  y: 0,
};
const rotationAngles: RotationAngles = {
  current: 0,
  initial: 0,
};
const centerSpreadWeight: CenterSpreadWeight = {
  weight: 0,
};

onmessage = ({ data }: { data: ParticlesWorkerPayload }) => {
  switch (data.operation) {
    case ParticlesWorkerOperation.Init:
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
        rotationAngles,
        screenSize,
        centerSpreadWeight,
      });
      break;
    case ParticlesWorkerOperation.Resize:
      //TODO figure out later why this shit doesn't work.
      break;
      const { newWidth, newHeight } = data.resize!;
      screenSize.width = newWidth;
      screenSize.height = newHeight;

      break;
    default:
  }
};
