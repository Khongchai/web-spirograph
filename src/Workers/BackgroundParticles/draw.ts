import colors from "../../constants/colors";

export default function drawParticles({
  ctx,
  screenSize,
}: {
  ctx: OffscreenCanvasRenderingContext2D;
  screenSize: {
    width: number;
    height: number;
  };
}) {
  const { width, height } = screenSize;

  ctx.fillStyle = colors.purple.dark;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "white";
  ctx.moveTo(0, 0);
  ctx.lineTo(width, height);
  ctx.stroke();

  requestAnimationFrame(() => drawParticles({ ctx, screenSize }));
}
