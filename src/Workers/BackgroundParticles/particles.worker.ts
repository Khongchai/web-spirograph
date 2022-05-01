import drawParticles from "./draw";
import ParticlesWorkerPayload, { ParticlesWorkerOperation } from "./payloads";

const screenSize = {
  width: 0,
  height: 0,
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

      drawParticles({ ctx, screenSize });
      break;
    case ParticlesWorkerOperation.Resize:
      const { newWidth, newHeight } = data.resize!;
      screenSize.width = newWidth;
      screenSize.height = newHeight;

      break;
    default:
  }
};
