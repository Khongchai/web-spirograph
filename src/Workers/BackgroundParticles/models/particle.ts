import { Vector2 } from "../../../classes/vector2";
import { Vector3 } from "../../../classes/vector3";
import ScreenSize from "./ScreenSize";

export default class Particle implements Vector3 {
  initialX: number;
  initialY: number;
  initialZ: number;
  vx: number;
  vz: number;
  vy: number;
  radius: number;
  x: number;
  y: number;
  z: number;
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  shadowColor: {
    r: number;
    g: number;
    b: number;
    a: number;
  };

  constructor({
    x,
    y,
    z,
    initialX,
    initialY,
    initialZ,
    radius,
    color,
    shadowColor,
  }: {
    x: number;
    y: number;
    z: number;
    initialX: number;
    initialY: number;
    initialZ: number;
    radius: number;
    color: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    shadowColor: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  }) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.initialX = initialX;
    this.initialY = initialY;
    this.initialZ = initialZ;
    this.radius = radius;
    this.color = color;
    this.shadowColor = shadowColor;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
  }

  getScreenCoordinates(screenSize: ScreenSize): Vector2 {
    //TODO
    return { x: 0, y: 0 };
  }
}
