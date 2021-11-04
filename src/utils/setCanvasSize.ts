export default function setCanvasSize(
  canvas: HTMLCanvasElement,
  extraSetUp?: Function
) {
  canvas.setAttribute("width", canvas.clientWidth.toString());
  canvas.setAttribute("height", canvas.clientHeight.toString());
  extraSetUp && extraSetUp();

  const size = {
    w: canvas.clientWidth,
    h: canvas.clientHeight,
  };

  window.addEventListener("resize", () => {
    size.w = canvas.clientHeight;
    size.h = canvas.clientWidth;
    canvas.setAttribute("width", canvas.clientWidth.toString());
    canvas.setAttribute("height", canvas.clientHeight.toString());
    extraSetUp && extraSetUp();
  });
}
