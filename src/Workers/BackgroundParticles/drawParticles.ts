import colors from "../../constants/colors";

let _context: OffscreenCanvasRenderingContext2D;
let _screenSize: {width: number, height: number};

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

function draw(){
  const {width, height} = _screenSize;

  _context.fillStyle = colors.purple.dark;
  _context.fillRect(0, 0, width, height);


  requestAnimationFrame(draw);
}
