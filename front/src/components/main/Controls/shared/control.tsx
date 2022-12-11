import React from "react";
import BooleanValueControl from "../BooleanValueControl";
import SidebySideButtonsControl from "../SidebySideButtonsControl";
import DraggableValue from "./DraggableValueControl";

export type DragBehavior = {
  onDrag: (newValue: number) => void;
  numberValue: number;
  constraints?: { min: number; max: number };
  step?: number;
};

export type BooleanSwitchBehavior = {
  defaultBooleanValue: boolean;
  onClick: (newValue: boolean) => void;
};

export type SidebySideButtonsVariant = {
  onLeftClicked: VoidFunction;
  onRightClicked: VoidFunction;
};

/**
 * Settings contains three variants: Drag, BooleanSwitch, and SideBySideButtons
 */
type SettingsType = {
  paramName: string;
} & (DragBehavior | BooleanSwitchBehavior | SidebySideButtonsVariant);

const Settings: React.FC<SettingsType> = (props) => {
  if ("onClick" in props) {
    return (
      <Wrapper
        children={
          <BooleanValueControl
            defaultBooleanValue={props.defaultBooleanValue}
            onClick={props.onClick!}
          />
        }
        paramName={props.paramName}
      />
    );
  } else if ("onDrag" in props) {
    return (
      <Wrapper
        children={
          <DraggableValue
            onDrag={props.onDrag}
            value={props.numberValue}
            step={props.step}
            constraints={props.constraints}
          />
        }
        paramName={props.paramName}
      />
    );
  } else {
    return (
      <Wrapper
        children={
          <SidebySideButtonsControl
            onLeftClicked={props.onLeftClicked}
            onRightClicked={props.onRightClicked}
          />
        }
        paramName={props.paramName}
      />
    );
  }
};

export default Settings;

function Wrapper({
  children,
  paramName,
}: {
  children: React.ReactNode;
  paramName: string;
}) {
  return (
    <div className="flex flex-row items-start">
      <h2 className="font-bold text-base mr-1.5">{paramName}: </h2>
      <div>{children}</div>
    </div>
  );
}
