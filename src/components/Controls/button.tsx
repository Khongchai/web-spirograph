import React from "react";

interface buttonProps {
  innerHTML: string;
  blur: boolean;
}

const SelectionButton: React.FC<buttonProps> = ({ innerHTML, blur }) => {
  return (
    <button
      style={{ filter: blur ? "blur(1px)" : "" }}
      className="px-3 py-2 bg-purple-dull text-purple-dark rounded mr-2 hover-no-blur transition-all"
    >
      {innerHTML}
    </button>
  );
};

export default SelectionButton;
