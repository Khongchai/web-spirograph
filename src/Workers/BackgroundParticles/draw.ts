import colors from "../../constants/colors";

export default function drawParticles({
  ctx,
  width,
  height,
}: {
  ctx: OffscreenCanvasRenderingContext2D;
  width: number;
  height: number;
}) {
  ctx.fillStyle = colors.purple.dark;
  ctx.fillRect(0, 0, width, height);

  requestAnimationFrame(() => drawParticles({ ctx, width, height }));
}
