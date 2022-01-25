import React from "react";
import useStateEffect from "./shared/utils/useStateEffect";

interface BooleanValueControlProps {
  value: boolean;
  onClick: (newValue: boolean) => void;
}

const BooleanValueControl: React.FC<BooleanValueControlProps> = ({
  value,
  onClick,
}) => {
  const [newValue, setNewValue] = useStateEffect(value);
  return (
    <h3
      className="text-whit cursor-pointer select-none"
      onClick={() => {
        const _newValue = !newValue;
        setNewValue(_newValue);
        onClick(_newValue);
      }}
    >
      {newValue.toString()}
    </h3>
  );
};

export default BooleanValueControl;
