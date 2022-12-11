export default interface Renderer {
  render(): void;
  resize(newWidth: number, newHeight: number): void;
}
