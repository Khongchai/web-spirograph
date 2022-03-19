import { Vector2 } from "../../types/vector2";

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
  parentDrawNode?: DrawNode;

  pos: Vector2;
  radius: number;

  color?: string;
  thickness?: number;

  /**
   * The indices of the node and its parent in the cycloidParams array.
   */
  ids: {
    /**
     * This element's index in the cycloidParams array.
     */
    thisNodeId: number;
    /**
     * The parent's index in the cycloidParams array.
     */
    parentId?: number;
  };
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
