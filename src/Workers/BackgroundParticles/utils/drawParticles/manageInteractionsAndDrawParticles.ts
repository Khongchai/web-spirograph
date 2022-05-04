import { Vector2 } from "../../../../classes/vector2";
import { Vector3 } from "../../../../classes/vector3";
import RepellerData from "../../models/RepellerData";
import MousePos from "../../models/MousePos";
import Particle from "../../models/particle";

export default function manageInteractionsAndDrawParticles(
  ctx: OffscreenCanvasRenderingContext2D,
  particles: Particle[],
  focalLength: number,
  mousePos: MousePos,
  tick: number,
  repellerData: RepellerData,
  screenCenter: Vector2
) {
  ctx.shadowBlur = 10;
  particles.forEach((p) => {
    saveTransform(ctx);
    const { x, y, z } = rotateBasedOnWeight({
      p: spreadOrShrink(lissajousNoise(p, tick), repellerData, screenCenter),
      tick,
      repellerData,
    });

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

  const rotateXNoise = Math.cos(Math.PI + tick * 0.00005) * 10;
  const rotateZNoise = 100 + Math.sin(Math.PI + tick * 0.00004) * 100;

  return {
    x: noisedX + rotateXNoise,
    y: noisedY,
    z: noisedZ + rotateZNoise,
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
  centerSpreadWeight: RepellerData,
  screenCenter: Vector2
) {
  // P is Vector3, but we'll be using only x and y
  const dx = p.x - screenCenter.x;
  const dy = p.y - screenCenter.y;
  const dist = Math.sqrt(
    Math.pow(p.x - screenCenter.x, 2) + Math.pow(p.y - screenCenter.y, 2)
  );

  const {
    desiredRepellerSize,
    repellerCurrentSize,
    beginLerping: flag,
    lerpWeight,
  } = centerSpreadWeight;

  centerSpreadWeight.repellerCurrentSize = lerp(
    repellerCurrentSize,
    desiredRepellerSize * flag,
    lerpWeight
  );

  //TODO use repellerCurrentSize

  let force = 0;
  if (dist < centerSpreadWeight.repellerCurrentSize) {
    force = (centerSpreadWeight.repellerCurrentSize - dist) * 0.1;
  }

  p.x += dx * force * 0.1;
  p.y += dy * force * 0.1;

  return p;
}

function rotateBasedOnWeight({
  p,
  tick,
  repellerData,
}: {
  p: Vector3;
  tick: number;
  repellerData: RepellerData;
}) {
  //TODO
  return p;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hooke(a: number, b: number, t: number) {
  return (a - b) * t;
}
