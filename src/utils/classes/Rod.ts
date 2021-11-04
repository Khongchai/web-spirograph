export default class Rod {
  private length: number;

  constructor(length: number) {
    this.length = length;
  }

  getLength = () => this.length;

  scaleLength(scalar: number) {
    this.length *= scalar;
  }

  drawRodPlease(
    context: CanvasRenderingContext2D,
    endPoint: { x: number; y: number },
    beginPoint: { x: number; y: number }
  ) {
    context.beginPath();
    context.moveTo(beginPoint.x, beginPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.stroke();
  }
}
