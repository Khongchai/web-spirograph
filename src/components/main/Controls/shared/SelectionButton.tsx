import React from "react";
import useForceUpdate from "../../../../utils/hooks/useForceUpdate";

interface buttonProps {
  innerHTML: string;
  blur: boolean;
  onClick: () => void;
}

const SelectionButton: React.FC<buttonProps> = ({
  innerHTML,
  blur,
  onClick,
}) => {
  const blurStyle = blur
    ? { filter: "blur(2px)", opacity: "0.5" }
    : ({} as any);
  return (
    <button
      onClick={() => {
        onClick();
      }}
      style={blurStyle}
      className="px-3 py-2 bg-purple-dull text-purple-dark rounded mr-2 
                hover-no-blur transition-all shadow-md hover:opacity-80 
                active:bg-purple-light 
                "
    >
      {innerHTML}
    </button>
  );
};

export default SelectionButton;
