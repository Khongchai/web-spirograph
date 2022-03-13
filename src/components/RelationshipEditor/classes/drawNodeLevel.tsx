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

  constructor(levels?: Record<string, DrawNode>[]) {
    this.levels = levels ?? this.levels;
  }

  getAllLevels = () => this.levels;

  getLevel = (levelIndex: number) => this.levels[levelIndex];

  retrieveNode = ({ level, key }: { level: number; key: string }) =>
    this.levels[level][key];

  getAllNodes = () => this.allNodes;

  getAllNodesExceptThis = (thisNodeIndex: number) => {
    const otherNodes = this.allNodes.filter(
      (node) => node.indices.index !== thisNodeIndex
    );
    return otherNodes;
  };

  setNode = ({
    level: levelIndex,
    drawNode,
    levelKey,
  }: {
    level: number;
    drawNode: DrawNode;
    levelKey: string;
  }) => {
    if (!this.levels[levelIndex]) {
      this.levels[levelIndex] = {};
    }

    this.levels[levelIndex][levelKey] = drawNode;
    this.allNodes.push(drawNode);
  };
}
