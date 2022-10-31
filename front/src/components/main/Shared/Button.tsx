import React from "react";

type ButtonProps = (
  | {
      onClick?: VoidFunction;
      additionalStyle?: any;
      buttonText: string;
      isFormSubmitButton?: false;
    }
  | {
      onClick?: never;
      additionalStyle?: any;
      buttonText: string;
      isFormSubmitButton: true;
    }
) & {
  onEnterPressed?: VoidFunction;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  additionalStyle,
  buttonText,
  isFormSubmitButton,
  onEnterPressed,
}) => {
  return (
    <button
      onKeyUp={(e) => {
        if (e.code === "Enter") {
          onEnterPressed?.();
        }
      }}
      type={isFormSubmitButton ? "submit" : "button"}
      onClick={onClick}
      style={{ ...additionalStyle, minHeight: "2.5rem" }}
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
