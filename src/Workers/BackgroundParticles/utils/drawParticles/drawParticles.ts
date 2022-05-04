//TODO on begin clicked, expand all dots to be farther from one another.
//TODO refactor this humongous mess.

import { Vector2 } from "../../../../classes/vector2";
import RepellerData from "../../models/RepellerData";
import Delta from "../../models/Delta";
import MousePos from "../../models/MousePos";
import Particle from "../../models/particle";
import RotationAngles from "../../models/RotationAngles";
import ScreenSize from "../../models/ScreenSize";
import manageInteractionsAndDrawParticles from "./manageInteractionsAndDrawParticles";

interface DrawParticlesParams {
  ctx: OffscreenCanvasRenderingContext2D;
  screenSize: ScreenSize;
  mousePos: MousePos;
  rotationAngles: RotationAngles;
  /**
   * The heavier this value, the more the particles will be spread out.
   */
  repellerData: RepellerData;
  screenCenter: Vector2;
}
export default function drawParticles({
  ctx,
  mousePos,
  rotationAngles,
  screenSize,
  repellerData,
  screenCenter,
}: DrawParticlesParams) {
  //Setup n stuff

  ctx.strokeStyle = "white";

  const particles: Particle[] = generateParticles({
    width: screenSize.width,
    height: screenSize.height,
    count: 20,
    // count: 1,
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
    repellerData,
    screenCenter,
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
  repellerData,
  screenCenter,
}: DrawParams) {
  const { width, height } = screenSize;

  const tick = delta.elapsedTotal;

  ctx.fillStyle = "rgba(43, 30, 57, 0.7)";
  ctx.fillRect(-width / 2, -height / 2, width, height);

  manageInteractionsAndDrawParticles(
    ctx,
    particles,
    focalLength,
    mousePos,
    tick,
    repellerData,
    screenCenter
  );

  requestAnimationFrame(() =>
    draw({
      ctx,
      focalLength,
      mousePos,
      particles,
      rotationAngles,
      screenSize,
      delta,
      repellerData: repellerData,
      screenCenter,
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
    const z = Math.random() * 2500;
    const newParticle: Particle = new Particle({
      x,
      y,
      z,
      radius: Math.random() * 10 + 2,
      color: {
        r: 231,
        g: 210,
        b: 253,
        a: 0.9,
      },
      shadowColor: {
        r: 300,
        g: 94,
        b: 27,
        a: 0.9,
      },
      initialX: x,
      initialY: y,
      initialZ: z,
    });

    particles.push(newParticle);
  }

  return particles;
}
