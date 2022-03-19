import { DrawNode } from "../types";

export default class DrawNodeLevel {
  private levels: Record<string, DrawNode>[] = [];
  /**
   * Gets updated everytime a node is set.
   *
   * A list of pointer back to the original DrawNode objects so
   * space is still O(n)
   */
  private allNodes: DrawNode[] = [];
  private allNodesAsKeyValuePairs: Record<string, DrawNode> = {};

  constructor(levels?: Record<string, DrawNode>[]) {
    this.levels = levels ?? this.levels;
  }

  getAllLevels = () => this.levels;

  getLevel = (levelIndex: number) => this.levels[levelIndex];

  retrieveNodeFromLevel = ({
    level,
    key,
  }: {
    level: number;
    key: string | number;
  }) => {
    const thisLevel = this.levels[level];

    if (!thisLevel) {
      throw new Error(`Level ${level} does not exist yet`);
    }

    const thisNode = thisLevel[key];
    if (!thisNode) {
      throw new Error(`Node with the key of: ${key} does not exist`);
    }

    return thisNode;
  };

  retrieveSingleNode = ({ key }: { key: string }) =>
    this.allNodesAsKeyValuePairs[key];

  getAllNodes = () => this.allNodes;

  getAllNodesExceptThis = (thisNodeIndex: number) => {
    const otherNodes = this.allNodes.filter(
      (node) => node.ids.thisNodeId !== thisNodeIndex
    );
    return otherNodes;
  };

  setNode = ({
    level: levelIndex,
    drawNode,
    levelKey: nodeKey,
  }: {
    level: number;
    drawNode: DrawNode;
    levelKey: string;
  }) => {
    if (!this.levels[levelIndex]) {
      this.levels[levelIndex] = {};
    }

    this.levels[levelIndex][nodeKey] = drawNode;
    this.allNodes.push(drawNode);

    this.allNodesAsKeyValuePairs[nodeKey] = drawNode;
  };
}
