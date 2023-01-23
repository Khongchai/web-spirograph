import React, { useEffect, useRef } from "react";

interface ModalBackgroundProps {
  children: React.ReactNode;
  onBgClicked?: () => void;
}

export default function ModalBackground({
  children,
  onBgClicked,
}: ModalBackgroundProps) {
  const obj = useRef<HTMLDivElement>(null);

  useEffect(() => {
    obj.current?.animate(
      [
        {
          opacity: 0,
          offset: 0,
        },
        {
          offset: 1,
          opacity: 0.8,
        },
      ],
      {
        fill: "forwards",
        duration: 100,
        iterations: 1,
      }
    );
  }, []);

  return (
    <div className="fixed w-full h-full grid bg-purple-dark place-items-center top-0 left-0" ref={obj}>
      <div className="z-20 w-full h-full grid place-items-center top-0 left-0 " onClick={onBgClicked}>
        {children}
      </div>

    </div>
  );
}
