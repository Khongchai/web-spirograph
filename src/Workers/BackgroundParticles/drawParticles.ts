//TODO on begin clicked, expand all dots to be farther from one another.

import colors from "../../constants/colors";
import CenterSpreadWeight from "./models/CenterSpreadWeight";
import Delta from "./models/Delta";
import MousePos from "./models/MousePos";
import Particle from "./models/particle";
import RotationAngles from "./models/RotationAngles";
import ScreenSize from "./models/ScreenSize";

interface DrawParticlesParams {
  ctx: OffscreenCanvasRenderingContext2D;
  screenSize: ScreenSize;
  mousePos: MousePos;
  rotationAngles: RotationAngles;
  /**
   * The heavier this value, the more the particles will be spread out.
   */
  centerSpreadWeight: CenterSpreadWeight;
}
export default function drawParticles({
  ctx,
  mousePos,
  rotationAngles,
  screenSize,
  centerSpreadWeight,
}: DrawParticlesParams) {
  //Setup n stuff

  ctx.strokeStyle = "white";

  const particles: Particle[] = generateParticles({
    width: screenSize.width,
    height: screenSize.height,
    count: 20,
  });

  const focalLength = 900;

  centerVanishingPoint(ctx, screenSize.width, screenSize.height);

  const delta = new Delta();

  draw({
    screenSize,
    ctx,
    focalLength,
    mousePos,
    particles,
    rotationAngles,
    delta,
    centerSpreadWeight,
  });
}

interface DrawParams extends DrawParticlesParams {
  particles: Particle[];
  focalLength: number;
  delta: Delta;
}
function draw({
  screenSize,
  ctx,
  focalLength,
  mousePos,
  particles,
  rotationAngles,
  delta,
  centerSpreadWeight,
}: DrawParams) {
  const { width, height } = screenSize;

  const tick = delta.elapsedTotal;

  ctx.fillStyle = "rgba(43, 30, 57, 0.7)";
  ctx.fillRect(-width / 2, -height / 2, width, height);

  _drawParticles(ctx, particles, focalLength, tick);

  requestAnimationFrame(() =>
    draw({
      ctx,
      focalLength,
      mousePos,
      particles,
      rotationAngles,
      screenSize,
      delta,
      centerSpreadWeight,
    })
  );
}

function centerVanishingPoint(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.translate(width / 2, height / 2);
}

function _drawParticles(
  ctx: OffscreenCanvasRenderingContext2D,
  particles: Particle[],
  focalLength: number,
  tick: number
) {
  particles.forEach((p) => {
    //3d lissajous curve
    const zNoise = Math.sin(tick * p.z * 0.000001) * 50;
    const xNoise = Math.sin(tick * p.x * 0.0000005) * 100;
    const yNoise = Math.sin(tick * p.y * 0.0000002) * 100;
    const perspective = focalLength / (focalLength + p.z + zNoise);

    ctx.save();

    ctx.scale(perspective, perspective);
    ctx.translate(p.x + xNoise, p.y + yNoise);

    ctx.beginPath();
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.shadowColor;
    ctx.fillStyle = p.color;
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });
}

function generateParticles({
  width,
  height,
  count,
}: {
  width: number;
  height: number;
  count: number;
}) {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width - width / 2;
    const y = Math.random() * height - height / 2;
    const z = Math.random() * 3000;
    const newParticle: Particle = {
      x,
      y,
      z,
      radius: Math.random() * 10 + 2,
      color: colors.purple.light,
      shadowColor: "rgba(300, 94, 27, 0.9)",
      initialX: x,
      initialY: y,
      initialZ: z,
    };
    newParticle.initialZ = newParticle.z;
    newParticle.initialX = newParticle.x;
    newParticle.initialY = newParticle.y;

    particles.push(newParticle);
  }

  return particles;
}
