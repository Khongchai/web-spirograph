import Rod from "./Rod";

export default class Cycloid {
  private radius: number;
  private point: { x: number; y: number };
  //basically cannot go beyond this value -- something % limit
  private dx: number = 0;
  private boundary: { x: number; y: number };

  private rod: Rod;

  private outerCircleRadius: number = 0;

  private insideOrOutsideBounding: "inside" | "outside";

  constructor(
    radius: number,
    point: { x: number; y: number },
    boundary: { x: number; y: number },
    insideOrOutsideBoudning: "inside" | "outside"
  ) {
    this.radius = radius;
    this.point = point;
    this.boundary = boundary;

    this.rod = new Rod(this.radius);

    this.outerCircleRadius = this.radius * 2;

    this.insideOrOutsideBounding = insideOrOutsideBoudning;
  }

  setDx(dx: number) {
    this.dx = dx;
  }

  private getCircumference() {
    return 2 * Math.PI * this.radius;
  }

  setOuterCircleRadius(radius: number) {
    this.outerCircleRadius = radius;
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
    let canvasCenter = { x: this.boundary.x / 2, y: this.boundary.y / 2 };
    //Angle 0
    let beginningPosInsideAnotherCircle = this.outerCircleRadius - this.radius;
    let dx = this.getdxAsRadians();
    let change =
      this.insideOrOutsideBounding === "inside"
        ? {
            dx: Math.sin(dx * 1.2),
            dy: Math.cos(dx * 1.2),
          }
        : { dx: Math.cos(dx), dy: Math.sin(dx) };
    let pos = {
      x: beginningPosInsideAnotherCircle * change.dx,
      y: beginningPosInsideAnotherCircle * change.dy,
    };

    let x = canvasCenter.x + pos.x;
    let y = canvasCenter.y + pos.y;

    /*
        Outside another circle
      */
    // const radiusScale = 105;
    // const outerCircleSpeedScale = 1.2;
    // let { x, y } = {
    //   x:
    //     //Get pathcovered in radians
    //     Math.cos(this.getdxAsRadians() * outerCircleSpeedScale) * radiusScale +
    //     this.boundary.x / 2,
    //   y:
    //     Math.sin(this.getdxAsRadians() * outerCircleSpeedScale) * radiusScale +
    //     this.boundary.y / 2,
    // };

    return {
      x,
      y,
    };
  }

  setBoundary(boundary: { x: number; y: number }) {
    this.boundary.x = boundary.x;
    this.boundary.y = boundary.y;
  }

  getPoint() {
    return { x: this.point.x, y: this.point.y };
  }

  showBoundingCircle(context: CanvasRenderingContext2D, radius?: number) {
    const x = this.boundary.x / 2;
    const y = this.boundary.y / 2;

    this.outerCircleRadius = radius || this.outerCircleRadius;

    context.beginPath();
    context.strokeStyle = "rgba(232, 121, 249, 1)";
    context.arc(x, y, this.outerCircleRadius, 0, Math.PI * 2);
    context.stroke();
  }

  showTheCircumferencePlease(context: CanvasRenderingContext2D) {
    const { x, y } = this.getCenter();
    context.beginPath();
    context.strokeStyle = "rgba(232, 121, 249, 1)";
    context.arc(x, y, this.radius, 0, Math.PI * 2);
    context.stroke();
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

  scaleRodLength(scalar: number) {
    this.rod.scaleLength(scalar);
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
