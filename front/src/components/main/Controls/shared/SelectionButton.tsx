import React from "react";
import Button from "../../Shared/Button";

interface buttonProps {
  text: string;
  blur: boolean;
  onClick: () => void;
}

const SelectionButton: React.FC<buttonProps> = ({ text, blur, onClick }) => {
  const blurStyle = blur
    ? { filter: "blur(2px)", opacity: "0.5" }
    : ({} as any);
  return (
    <Button onClick={onClick} additionalStyle={blurStyle} buttonText={text} />
  );
};

export default SelectionButton;
