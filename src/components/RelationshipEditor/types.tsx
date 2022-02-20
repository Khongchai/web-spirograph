import { Vector2 } from "../../types/vector2";

// A draw node that keeps track of its parent's position;
export type DrawNode = {
  parentIndex: number;
  pos: Vector2;
  radius: number;

  color?: string;
  thickness?: number;
};

export type DrawEdge = {
  start: Vector2;
  end: Vector2;

  color?: string;
  thickness?: number;
};
