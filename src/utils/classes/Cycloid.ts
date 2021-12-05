import colors from "../../constants/colors";
import { CycloidDirection as CycloidRotationDirection } from "../../types/cycloidDirection";
import Rod from "./Rod";

export default class Cycloid {
  private radius: number;
  private drawPoint: { x: number; y: number };
  //basically cannot go beyond this value -- something % limit
  private dx: number = 0;
  private parentMiddle: { x: number; y: number };
  private boundingCircleRadius: number = 0;
  private rotationDirection: CycloidRotationDirection;

  /*
    1 means the rod rotates at the same speed as the circle
  */
  private rodRotationSpeedRatio = 1;

  readonly rod: Rod;
  constructor(
    radius: number,
    point: { x: number; y: number },
    boundary: { x: number; y: number },
    rotationDirection: CycloidRotationDirection,
    outerCircleRadius: number
  ) {
    this.radius = radius;
    this.drawPoint = point;
    this.parentMiddle = boundary;

    this.rod = new Rod(this.radius);

    this.boundingCircleRadius = outerCircleRadius;

    this.rotationDirection = rotationDirection;
  }

  private getdxAsRadians() {
    return this.dx * 6 * (Math.PI / 180);
  }

  /*
    How much the circle moves depends on the circumference
  */
  getCenter() {
    let canvasCenter = {
      x: this.parentMiddle.x,
      y: this.parentMiddle.y,
    };
    //Angle 0
    let beginningPos = this.boundingCircleRadius - this.radius;
    let dx = this.getdxAsRadians();
    let change =
      this.rotationDirection === "clockwise"
        ? {
            dx: Math.sin(dx * this.rodRotationSpeedRatio),
            dy: Math.cos(dx * this.rodRotationSpeedRatio),
          }
        : {
            dx: Math.cos(dx * this.rodRotationSpeedRatio),
            dy: Math.sin(dx * this.rodRotationSpeedRatio),
          };
    let pos = {
      x: beginningPos * change.dx,
      y: beginningPos * change.dy,
    };

    let x = canvasCenter.x + pos.x;
    let y = canvasCenter.y + pos.y;

    return {
      x,
      y,
    };
  }

  move() {
    let { x, y } = this.getCenter();

    const theta = this.getdxAsRadians();
    const innerRotationSpeed = 1;

    const path = {
      x,
      y,
    };

    this.drawPoint.x =
      Math.cos(theta * innerRotationSpeed) * this.rod.getLength() + path.x;
    this.drawPoint.y =
      Math.sin(theta * innerRotationSpeed) * this.rod.getLength() + path.y;
  }
  showBoundingCirclePlease(context: CanvasRenderingContext2D) {
    const x = this.parentMiddle.x;
    const y = this.parentMiddle.y;

    context.beginPath();
    context.strokeStyle = colors.purple.light;

    context.arc(x, y, this.boundingCircleRadius, 0, Math.PI * 2);

    context.stroke();
  }

  showTheCircumferencePlease(context: CanvasRenderingContext2D) {
    const { x, y } = this.getCenter();
    context.beginPath();
    context.strokeStyle = colors.purple.light;
    context.arc(x, y, this.radius, 0, Math.PI * 2);
    context.stroke();
  }

  showPointPlease(context: CanvasRenderingContext2D) {
    context.fillStyle = colors.purple.light;
    context.beginPath();
    context.arc(this.drawPoint.x, this.drawPoint.y, 5, 0, Math.PI * 2);
    context.fill();
  }

  showRodPlease(context: CanvasRenderingContext2D) {
    const { x, y } = this.getCenter();
    this.rod.drawRodPlease(
      context,
      {
        x,
        y,
      },
      {
        x: this.drawPoint.x,
        y: this.drawPoint.y,
      }
    );
  }

  getDrawPoint = () => this.drawPoint;

  setParentMiddle(parentMiddle: { x: number; y: number }) {
    this.parentMiddle.x = parentMiddle.x;
    this.parentMiddle.y = parentMiddle.y;
  }

  setPoint = (point: { x: number; y: number }) => (this.drawPoint = point);

  getRadius = () => this.radius;

  setDx = (dx: number) => (this.dx = dx);

  setRotationDirection = (direction: CycloidRotationDirection) =>
    (this.rotationDirection = direction);

  setRodRotationSpeedRatio = (ratio: number) =>
    (this.rodRotationSpeedRatio = ratio);

  setRadius = (radius: number) => (this.radius = radius);
}
