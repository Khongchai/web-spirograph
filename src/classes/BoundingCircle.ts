import colors from "../constants/colors";
import { Vector2 } from "../types/vector2";

export default class BoundingCircle {
  protected centerPoint: Vector2;
  protected radius: number;

  constructor(centerPoint: Vector2, radius: number) {
    this.centerPoint = centerPoint;
    this.radius = radius;
  }

  getCenterPoint = () => this.centerPoint;

  getRadius = () => this.radius;

  setCenterPoint = (centerPoint: Vector2) => (this.centerPoint = centerPoint);

  setRadius = (radius: number) => (this.radius = radius);

  showBounding(ctx: CanvasRenderingContext2D) {
    //Draw outer bounding circle
    const { x, y } = this.centerPoint;

    ctx.beginPath();
    ctx.strokeStyle = colors.purple.light;

    ctx.arc(x, y, this.radius, 0, Math.PI * 2);

    ctx.stroke();
  }
}
