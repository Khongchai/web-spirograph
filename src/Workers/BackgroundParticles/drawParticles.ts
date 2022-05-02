import colors from "../../constants/colors";
import Vector3 from "./classes/vector3";

let _context: OffscreenCanvasRenderingContext2D;
let _screenSize: { width: number, height: number };

export default function drawParticles(
  ctx: OffscreenCanvasRenderingContext2D,
  screenSize: {
    width: number;
    height: number;
  },
) {
  //Setup n stuff
  _screenSize = screenSize;
  _context = ctx;

  _context.fillStyle = colors.purple.dark;
  _context.strokeStyle = "white";

  draw();
}

function draw() {
  const { width, height } = _screenSize;

  _context.fillStyle = colors.purple.dark;
  _context.fillRect(0, 0, width, height);


  requestAnimationFrame(draw);
}

function centerVanishingPoint(ctx: OffscreenCanvasRenderingContext2D) {
  ctx.translate(_screenSize.width / 2, _screenSize.height / 2);
}

//TODO generate particles first.
function generateParticles(particlesArray: Vector3) {
  const {width, height} = _screenSize;

  for (let i = 0; i < 200; i++) {
    const newParticle = {
      x: Math.random() * width - width / 2,
      y: Math.random() * -height * 2,
      z: Math.random() * 4000,
      radius: Math.random() * 3 + 2,
      color: "rgba(240, 94, 27, 0.7)",
      shadowColor: "rgba(300, 94, 27, 0.9)",
    };
    newParticle.initialZ = newParticle.z;
    newParticle.initialX = newParticle.x;
    newParticle.initialY = newParticle.y;

    particlesArray.push(newParticle);
  }
}
