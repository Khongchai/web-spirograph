export default interface Renderer {
  render(): void;
  resize(newWidth: number, newHeight: number): void;
  applyTransformation(mat: { dx: number; dy: number; dz: number }): void;
}
