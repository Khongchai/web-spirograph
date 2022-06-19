import { BoundingCircleInterface } from "../interfaces/BoundingCircleInterface";
import { Vector2 } from "../interfaces/vector2";

export default class BoundingCircle implements BoundingCircleInterface {
  centerPoint: Vector2;
  radius: number;
  boundingColor: string;

  constructor(centerPoint: Vector2, radius: number, boundingColor: string) {
    this.centerPoint = centerPoint;
    this.radius = radius;
    this.boundingColor = boundingColor;
  }

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
