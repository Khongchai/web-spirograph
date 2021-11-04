import colors from "../../constants/colors";
import { CycloidRotationDirection } from "../types/cycloidPosition";
import Rod from "./Rod";

export default class Cycloid {
  private radius: number;
  readonly point: { x: number; y: number };
  //basically cannot go beyond this value -- something % limit
  private dx: number = 0;
  private screenSize: { x: number; y: number };
  private boundingCircleRadius: number = 0;
  private insideOrOutsideAnotherCircle: CycloidRotationDirection;

  /*
    1 means the rod rotates at the same speed as the circle
  */
  private rodRotationSpeedRatio = 1;

  readonly rod: Rod;
  constructor(
    radius: number,
    point: { x: number; y: number },
    boundary: { x: number; y: number },
    insideOrOutsideAnotherCircle: CycloidRotationDirection,
    outerCircleRadius: number
  ) {
    this.radius = radius;
    this.point = point;
    this.screenSize = boundary;

    this.rod = new Rod(this.radius);

    this.boundingCircleRadius = outerCircleRadius;

    this.insideOrOutsideAnotherCircle = insideOrOutsideAnotherCircle;
  }

  setDx(dx: number) {
    this.dx = dx;
  }

  setCycloidRotationDirection(newPos: CycloidRotationDirection) {
    this.insideOrOutsideAnotherCircle = newPos;
  }

  private getCircumference() {
    return 2 * Math.PI * this.radius;
  }

  setRodRotationSpeedRatio(ratio: number) {
    this.rodRotationSpeedRatio = ratio;
  }

  setOuterCircleRadius(radius: number) {
    this.boundingCircleRadius = radius;
  }

  setRadius(radius: number) {
    this.radius = radius;
  }

  private getdxAsRadians() {
    return this.dx * 6 * (Math.PI / 180);
  }

  private getPathCovered() {
    // one rotation within 60 dx
    const cycloidRotationSpeedScale = 1;
    let pathCovered = (this.dx * this.getCircumference()) / 60;
    pathCovered *= cycloidRotationSpeedScale;

    return pathCovered;
  }

  /*
    How much the circle moves depends on the circumference
  */
  private getCenter() {
    /*
      Switching sin and cos would be the equivalent of being inside or outside another circle.

      Think of a physical spirograph and how the cog moves the circle inside and outside. That's your answer.
    */
    let canvasCenter = { x: this.screenSize.x / 2, y: this.screenSize.y / 2 };
    //Angle 0
    let beginningPosInsideAnotherCircle =
      this.boundingCircleRadius - this.radius;
    let dx = this.getdxAsRadians();
    let change =
      this.insideOrOutsideAnotherCircle === "clockwise"
        ? {
            dx: Math.sin(dx * this.rodRotationSpeedRatio),
            dy: Math.cos(dx * this.rodRotationSpeedRatio),
          }
        : {
            dx: Math.cos(dx * this.rodRotationSpeedRatio),
            dy: Math.sin(dx * this.rodRotationSpeedRatio),
          };
    let pos = {
      x: beginningPosInsideAnotherCircle * change.dx,
      y: beginningPosInsideAnotherCircle * change.dy,
    };

    let x = canvasCenter.x + pos.x;
    let y = canvasCenter.y + pos.y;

    return {
      x,
      y,
    };
  }

  setBoundary(boundary: { x: number; y: number }) {
    this.screenSize.x = boundary.x;
    this.screenSize.y = boundary.y;
  }

  move() {
    const { x, y } = this.getCenter();

    const theta = this.getdxAsRadians();
    const innerRotationSpeed = 1;

    const path = {
      x,
      y,
    };

    this.point.x =
      Math.cos(theta * innerRotationSpeed) * this.rod.getLength() + path.x;
    this.point.y =
      Math.sin(theta * innerRotationSpeed) * this.rod.getLength() + path.y;
  }
  showBoundingCirclePlease(context: CanvasRenderingContext2D) {
    const x = this.screenSize.x / 2;
    const y = this.screenSize.y / 2;

    context.beginPath();
    context.strokeStyle = colors.purple.light;

    if (this.insideOrOutsideAnotherCircle === "counterClockwise") {
      const innerCircleRadius = Math.abs(
        this.boundingCircleRadius - this.radius * 2
      );
      context.arc(x, y, innerCircleRadius, 0, Math.PI * 2);
    } else {
      context.arc(x, y, this.boundingCircleRadius, 0, Math.PI * 2);
    }

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
    context.arc(this.point.x, this.point.y, 5, 0, Math.PI * 2);
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
        x: this.point.x,
        y: this.point.y,
      }
    );
  }
}
