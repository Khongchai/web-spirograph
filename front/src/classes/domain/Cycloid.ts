import { CycloidDirection as CycloidRotationDirection } from "../../types/cycloidDirection";
import BoundingCircle from "./BoundingCircle";
import Rod from "./Rod";
import { Vector2 } from "../interfaces/vector2";

export default class Cycloid extends BoundingCircle {
  private static allCycloids: Record<string, Cycloid> = {};

  private drawPoint: Vector2;

  // The global reference id shared by CycloidControls and DrawNode
  private id: number;

  /**
   * The timestep, basically.
   *
   * The smaller, the more refined the curves.
   */
  private animationSpeed: number = 0;

  private parentBounding: BoundingCircle;

  private rotationDirection: CycloidRotationDirection;

  /*
    1 means the rod rotates at the same speed as the bounding circle.
  */
  private rodRotationSpeedScale = 1;

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
    // If animationSpeed is 1, the cycloid will complete 1
    // rotation around its parent within a second.
    const step = (Math.PI * 2) / 60;
    return this.animationSpeed * step;
  }

  /*
    How much the circle moves depends on the circumference
  */
  private calculateCenter() {
    // Get the center point of parent,
    // this abstraction allows us to obtain the center point of the parent,
    // regardless of whether that parent is static or moving.
    const parentCenter = this.parentBounding.centerPoint;

    //At angle 0
    const offset = this.isOutsideOfParent ? this.radius : -this.radius;
    let beginningPos = this.parentBounding.radius + offset;

    let dx = this.animationSpeedAsRadians();
    let change =
      this.rotationDirection === "clockwise"
        ? {
            dx: Math.sin(dx * this.rodRotationSpeedScale),
            dy: Math.cos(dx * this.rodRotationSpeedScale),
          }
        : {
            dx: Math.cos(dx * this.rodRotationSpeedScale),
            dy: Math.sin(dx * this.rodRotationSpeedScale),
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

    const path = {
      x,
      y,
    };

    this.drawPoint.x = Math.cos(theta) * this.rod.getLength() + path.x;
    this.drawPoint.y = Math.sin(theta) * this.rod.getLength() + path.y;
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

  getId = () => this.id;

  getDrawPoint = () => this.drawPoint;

  setPoint = (point: { x: number; y: number }) => (this.drawPoint = point);

  getRadius = () => this.radius;

  getParent = () => this.parentBounding;

  setDx = (dx: number) => (this.animationSpeed = dx);

  setRotationDirection = (direction: CycloidRotationDirection) =>
    (this.rotationDirection = direction);

  setRodRotatationSpeedScale = (scalar: number) =>
    (this.rodRotationSpeedScale = scalar);

  setRadius = (radius: number) => (this.radius = radius);

  setIsOutsideOfParent = (isOutside: boolean) =>
    (this.isOutsideOfParent = isOutside);

  setParent = (parent: BoundingCircle) => (this.parentBounding = parent);
}
