export default class Delta {
  private now: number;

  constructor() {
    this.now = performance.now();
  }

  get elapsedPerFrame() {
    const now = performance.now();
    const dx = now - this.now;
    this.now = now;

    return dx;
  }

  get elapsedTotal() {
    const now = performance.now();
    const dx = now - this.now;

    return dx;
  }
}
