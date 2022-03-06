import colors from "../constants/colors";
import { Vector2 } from "../types/vector2";

export default class BoundingCircle {
  protected centerPoint: Vector2;
  protected radius: number;
  protected boundingColor: string;

  constructor(centerPoint: Vector2, radius: number, boundingColor: string) {
    this.centerPoint = centerPoint;
    this.radius = radius;
    this.boundingColor = boundingColor;
  }

  getCenterPoint = () => this.centerPoint;

  getRadius = () => this.radius;

  setCenterPoint = (centerPoint: Vector2) => (this.centerPoint = centerPoint);

  setRadius = (radius: number) => (this.radius = radius);

  showBounding(ctx: CanvasRenderingContext2D, boundingColor?: string) {
    this.boundingColor = boundingColor || this.boundingColor;
    //Draw outer bounding circle
    const { x, y } = this.centerPoint;

    ctx.beginPath();
    ctx.strokeStyle = this.boundingColor;

    ctx.arc(x, y, this.radius, 0, Math.PI * 2);

    ctx.stroke();
  }
}
