import React, { useEffect, useRef } from "react";
import { createTextSpanFromBounds } from "typescript";
import colors from "../constants/colors";

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    draw();
    function draw() {
      ctx.fillStyle = colors.purple.dark;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(draw);
    }
  }, []);

  return <canvas className="w-full h-full relative" ref={canvasRef}></canvas>;
}
