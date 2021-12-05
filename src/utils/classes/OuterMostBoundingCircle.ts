import colors from "../../constants/colors";

export default class BoundingCircle {
  private x: number;
  private y: number;
  private radius: number;

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  //getters for all variables
  getX(): number {
    return this.x;
  }
  getY(): number {
    return this.y;
  }
  getRadius(): number {
    return this.radius;
  }

  drawCircumference(ctx: CanvasRenderingContext2D) {
    //Draw outer bounding circle
    const x = this.x;
    const y = this.y;

    ctx.beginPath();
    ctx.strokeStyle = colors.purple.light;

    ctx.arc(x, y, this.radius, 0, Math.PI * 2);

    ctx.stroke();
  }
}
