import React from "react";

interface ButtonProps {
  onClick: VoidFunction;
  additionalStyle?: any;
  buttonText: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  additionalStyle,
  buttonText,
}) => {
  return (
    <button
      onClick={onClick}
      style={additionalStyle}
      className="px-3 py-2 bg-purple-dull text-purple-dark rounded mr-2 
                      hover-no-blur transition-all shadow-md hover:opacity-80 
                      active:bg-purple-light 
                      "
    >
      {buttonText}
    </button>
  );
};

export default Button;
