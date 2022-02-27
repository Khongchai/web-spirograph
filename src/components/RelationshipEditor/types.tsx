import { Vector2 } from "../../types/vector2";

/**
 * The number is the index assigned initially in the cycloidparmas array.
 */
export type DrawNodeLevel = Record<string, DrawNode>[];

// A draw node that keeps track of its parent's position;
export type DrawNode = {
  /**
   * The current draw level of that node
   */
  currentDrawLevel: number;

  /**
   * The parent draw node.
   *
   * This is needed to position a node directly under its parent when there exist multiple nodes on the same level as its parent.
   *
   * If the node has no parent, then null (base bounding circle has no parents).
   */
  parentDrawNode: DrawNode | null;

  pos: Vector2;
  radius: number;

  color?: string;
  thickness?: number;

  meta?: NodeMetaData;
};

// Index from the cycloidParams array
export type NodeMetaData = {
  index: number;
  parentIndex: number;
};

export type DrawEdge = {
  start: Vector2;
  end: Vector2;

  color?: string;
  thickness?: number;
};
