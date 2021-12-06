import React from "react";

interface buttonProps {
  innerHTML: string;
  blur: boolean;
  onClick?: () => void;
}

const SelectionButton: React.FC<buttonProps> = ({
  innerHTML,
  blur,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{ filter: blur ? "blur(2px)" : "" }}
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
