import { Vector2 } from "../../../../classes/vector2";
import { Vector3 } from "../../../../classes/vector3";
import CenterSpreadWeight from "../../models/CenterSpreadWeight";
import MousePos from "../../models/MousePos";
import Particle from "../../models/particle";

export default function manageInteractionsAndDrawParticles(
  ctx: OffscreenCanvasRenderingContext2D,
  particles: Particle[],
  focalLength: number,
  mousePos: MousePos,
  tick: number,
  centerSpreadWeight: CenterSpreadWeight,
  screenCenter: Vector2
) {
  ctx.shadowBlur = 10;
  particles.forEach((p) => {
    //TODO spread everything from the center.

    const { x, y, z } = spreadOrShrink(lissajousNoise(p, tick), tick, ctx);

    saveTransform(ctx);

    setFillIntensityBasedOnDistanceToCursor(mousePos, p, ctx);

    positionPoints(ctx, getPerspective(focalLength, z), { x, y });

    drawParticle(ctx, p);

    restoreTransform(ctx);
  });
}

function lissajousNoise(p: Particle, tick: number) {
  //3d lissajous curve
  const zNoise = Math.sin(tick * p.z * 0.000001) * 60;
  const xNoise = Math.cos(tick * p.x * 0.0000005) * 95;
  const yNoise = Math.sin(tick * p.y * 0.0000003) * 100;

  // Noise the values
  const noisedX = p.x + xNoise;
  const noisedY = p.y + yNoise;
  const noisedZ = p.z + zNoise;

  return {
    x: noisedX,
    y: noisedY,
    z: noisedZ,
  };
}

function getPerspective(focalLength: number, z: number): number {
  return focalLength / (focalLength + z);
}

function saveTransform(ctx: OffscreenCanvasRenderingContext2D) {
  ctx.save();
}

function restoreTransform(ctx: OffscreenCanvasRenderingContext2D) {
  ctx.restore();
}

function positionPoints(
  ctx: OffscreenCanvasRenderingContext2D,
  perspective: number,
  { x: noisedX, y: noisedY }: Vector2
) {
  ctx.scale(perspective, perspective);
  ctx.translate(noisedX, noisedY);
}

function setFillIntensityBasedOnDistanceToCursor(
  mousePos: Vector2,
  p: Particle,
  ctx: OffscreenCanvasRenderingContext2D
) {
  const dist = Math.sqrt(
    Math.pow(mousePos.x - p.x, 2) + Math.pow(mousePos.y - p.y, 2)
  );
  const distThreshold = 200;
  let alpha = distThreshold / Math.max(dist, distThreshold);
  alpha = Math.max(Math.min(alpha, 1), 0.3);

  ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${
    0.1 + alpha
  })`;
  ctx.shadowColor = `rgba(${p.shadowColor.r}, ${p.shadowColor.g}, ${
    p.shadowColor.b
  }, ${0.1 + alpha})`;
}

function drawParticle(ctx: OffscreenCanvasRenderingContext2D, p: Particle) {
  ctx.beginPath();
  ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
  ctx.fill();
}

function spreadOrShrink(
  p: Vector3,
  tick: number,
  ctx: OffscreenCanvasRenderingContext2D
) {
  //TODO
  return p;
}
