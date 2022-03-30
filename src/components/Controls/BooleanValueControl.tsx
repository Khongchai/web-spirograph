import React from "react";
import { BooleanSwitchBehavior } from "./shared/control";
import useStateEffect from "./shared/utils/useStateEffect";

const BooleanValueControl: React.FC<BooleanSwitchBehavior> = ({
  defaultBooleanValue,
  onClick,
}) => {
  const [newValue, setNewValue] = useStateEffect(defaultBooleanValue);
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
