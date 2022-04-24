export default function setCanvasSize(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  extraSetUp?: Function
) {
  canvas.setAttribute("width", width.toString());
  canvas.setAttribute("height", height.toString());

  extraSetUp?.();

  window.addEventListener("resize", () => {
    canvas.setAttribute("width", width.toString());
    canvas.setAttribute("height", height.toString());

    extraSetUp?.();
  });
}
