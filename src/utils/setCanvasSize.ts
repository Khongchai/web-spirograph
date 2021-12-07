export default function setCanvasSize(
  canvas: HTMLCanvasElement,
  extraSetUp?: Function
) {
  const parent = canvas.parentElement;
  const parentWidth = parent!.clientWidth;
  const parentHeight = parent!.clientHeight;
  canvas.setAttribute("width", parentWidth.toString());
  canvas.setAttribute("height", parentHeight.toString());
  extraSetUp && extraSetUp();

  window.addEventListener("resize", () => {
    const parent = canvas.parentElement;
    const parentWidth = parent!.clientWidth;
    const parentHeight = parent!.clientHeight;
    canvas.setAttribute("width", parentWidth.toString());
    canvas.setAttribute("height", parentHeight.toString());
    extraSetUp && extraSetUp();
  });
}
