import { Vector2 } from "../../../classes/interfaces/vector2";

// A draw node that keeps track of its parent's position;
export type DrawNode = {
  /**
   * The current draw level of that node
   */
  currentDrawLevel: number;

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
