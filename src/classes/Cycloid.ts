import colors from "../constants/colors";
import { CycloidDirection as CycloidRotationDirection } from "../types/cycloidDirection";
import { Vector2 } from "../types/vector2";
import BoundingCircle from "./BoundingCircle";
import Rod from "./Rod";

export default class Cycloid extends BoundingCircle {
  private static allCycloids: Record<string, Cycloid> = {};

  private drawPoint: Vector2;

  // The global reference id shared by CycloidControls and DrawNode
  private id: number;

  //basically cannot go beyond this value -- something % limit
  private animationSpeed: number = 0;

  private parentBounding: BoundingCircle;

  private rotationDirection: CycloidRotationDirection;

  /*
    1 means the rod rotates at the same speed as the circle
  */
  private rodRotationSpeedRatio = 1;

  private isOutsideOfParent: boolean;

  readonly rod: Rod;

  constructor(
    radius: number,
    rotationDirection: CycloidRotationDirection,
    parentBounding: BoundingCircle,
    moveOutsideOfParent = false,
    boundingColor: string,
    id: number
  ) {
    super({ x: 0, y: 0 }, radius, boundingColor);

    this.isOutsideOfParent = moveOutsideOfParent;

    this.drawPoint = { x: 0, y: 0 };

    this.rod = new Rod(radius);

    this.parentBounding = parentBounding;

    this.rotationDirection = rotationDirection;

    this.id = id;

    Cycloid.allCycloids[id] = this;
  }

  static getCycloidFromId = (id: number) => {
    const cycloid = Cycloid.allCycloids[id];

    if (!cycloid) {
      throw new Error(`No cycloid with the id of ${id}`);
    }

    return cycloid;
  };

  private animationSpeedAsRadians() {
    return this.animationSpeed * 6 * (Math.PI / 180);
  }

  /*
    How much the circle moves depends on the circumference
  */
  private calculateCenter() {
    // Get the center point of parent,
    // this abstraction allows us to obtain the center point of the parent,
    // regardless of whether that parent is static or moving.
    const parentCenter = this.parentBounding.getCenterPoint();

    //At angle 0
    const offset = this.isOutsideOfParent ? this.radius : -this.radius;
    let beginningPos = this.parentBounding.getRadius() + offset;

    let dx = this.animationSpeedAsRadians();
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

    let x = parentCenter.x + pos.x;
    let y = parentCenter.y + pos.y;

    this.centerPoint = { x, y };

    return {
      x,
      y,
    };
  }

  move() {
    let { x, y } = this.calculateCenter();

    const theta = this.animationSpeedAsRadians();

    //TODO => what's this?
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

  showPoint(context: CanvasRenderingContext2D) {
    context.fillStyle = this.boundingColor;
    context.beginPath();
    context.arc(this.drawPoint.x, this.drawPoint.y, 5, 0, Math.PI * 2);
    context.fill();
  }

  showRod(context: CanvasRenderingContext2D) {
    const { x, y } = this.calculateCenter();
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

  getId() {
    return this.id;
  }

  getDrawPoint() {
    return this.drawPoint;
  }

  setPoint(point: Vector2) {
    this.drawPoint = point;
  }

  getRadius() {
    return this.radius;
  }

  getParent() {
    return this.parentBounding;
  }

  setDx(dx: number) {
    this.animationSpeed = dx;
  }

  setRotationDirection(direction: CycloidRotationDirection) {
    this.rotationDirection = direction;
  }

  setRodRotationSpeedRatio(ratio: number) {
    this.rodRotationSpeedRatio = ratio;
  }

  setRadius(radius: number) {
    this.radius = radius;
  }

  setIsOutsideOfParent(isOutside: boolean) {
    this.isOutsideOfParent = isOutside;
  }

  setParent(parent: BoundingCircle) {
    this.parentBounding = parent;
  }
}
