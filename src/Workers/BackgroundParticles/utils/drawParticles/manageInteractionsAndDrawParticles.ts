import { Vector2 } from "../../../../classes/vector2";
import { Vector3 } from "../../../../classes/vector3";
import RepellerData from "../../models/RepellerData";
import MousePos from "../../models/MousePos";
import Particle from "../../models/particle";

//TODO refactor some methods into the Particle class.
export default function manageInteractionsAndDrawParticles(
  ctx: OffscreenCanvasRenderingContext2D,
  particles: Particle[],
  focalLength: number,
  mousePos: MousePos,
  tick: number,
  repellerData: RepellerData,
  screenCenter: Vector2
) {
  ctx.shadowBlur = 20;
  particles.forEach((p) => {
    saveTransform(ctx);

    rotateBasedOnWeight({
      p,
      repellerData,
    });

    spread(p, repellerData, screenCenter);

    p.update();

    lissajousNoise(p, tick);

    const perspective = getPerspective(focalLength, p.z);

    setFillIntensityBasedOnDistanceToCursor(mousePos, p, ctx, perspective);

    positionPoints(ctx, perspective, p);

    drawParticle(ctx, p);

    restoreTransform(ctx);
  });
}

function lissajousNoise(p: Particle, tick: number) {
  //3d lissajous curve
  const zNoise = Math.acos(Math.cos(tick * p.initialZ * 0.00001 * 0.9)) * 0.9;
  const xNoise = Math.cos(tick * p.initialX * 0.000002) * 7;
  const yNoise = Math.sin(tick * p.initialY * 0.000003) * 0.3;

  p.x += xNoise;
  p.y += yNoise;
  p.z += zNoise;
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
  { x, y }: Vector2
) {
  ctx.scale(perspective, perspective);
  ctx.translate(x, y);
}

function setFillIntensityBasedOnDistanceToCursor(
  mousePos: Vector2,
  p: Particle,
  ctx: OffscreenCanvasRenderingContext2D,
  perspective: number
) {
  const { x, y } = p.getProjected2dCoordinate({ perspective });
  const dist = Math.sqrt(
    Math.pow(mousePos.x - x, 2) + Math.pow(mousePos.y - y, 2)
  );
  const distThreshold = 150;
  let alpha = distThreshold / Math.max(dist, distThreshold);
  alpha = Math.max(Math.min(alpha, 0.6), 0.2);

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

function spread(
  p: Vector3,
  repellerData: RepellerData,
  screenCenter: Vector2,
  ctxForDebugging?: OffscreenCanvasRenderingContext2D
) {
  // P is Vector3, but we'll be using only x and y
  const dx = p.x - screenCenter.x;
  const dy = p.y - screenCenter.y;
  const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  const {
    desiredRepellerSize,
    repellerCurrentSize,
    beginLerping: flag,
    lerpWeight,
  } = repellerData;

  repellerData.repellerCurrentSize = lerp(
    repellerCurrentSize,
    desiredRepellerSize * flag,
    lerpWeight
  );

  let force =
    dist < repellerData.repellerCurrentSize
      ? (repellerData.repellerCurrentSize - dist) * 0.1
      : 0;

  //Draws the repeller
  if (ctxForDebugging) {
    ctxForDebugging.strokeStyle = "white";
    ctxForDebugging.beginPath();
    ctxForDebugging.arc(
      screenCenter.x,
      screenCenter.y,
      repellerData.repellerCurrentSize,
      0,
      Math.PI * 2
    );
    ctxForDebugging.stroke();
  }

  p.vx = dx * force * 0.01;
  p.vy = dy * force * 0.01;

  return p;
}

function rotateBasedOnWeight({
  p,
  repellerData,
}: {
  p: Particle;
  repellerData: RepellerData;
}) {
  const { beginLerping, currentRotationAngle, lerpWeight } = repellerData;

  repellerData.currentRotationAngle = lerp(
    currentRotationAngle,
    Math.PI * beginLerping,
    lerpWeight * 0.2
  );

  const radius = 150;
  p.x = p.initialX + Math.cos(p.initialZ + currentRotationAngle) * radius;
  p.z = p.initialZ + 40 + Math.sin(p.initialZ + currentRotationAngle) * radius;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
