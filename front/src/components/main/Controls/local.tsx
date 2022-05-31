import { useContext } from "react";
import CycloidParams from "../../../classes/CycloidParams";
import { Rerender, RerenderToggle } from "../../../contexts/rerenderToggle";
import { RerenderReason } from "../../../types/contexts/rerenderReasons";
import useForceUpdate from "../../../utils/hooks/useForceUpdate";
import Control from "./shared/control";
import ControlContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import SelectionButton from "./shared/SelectionButton";

const Local: React.FC<{
  cycloid: CycloidParams;
  tooltipText: string;
}> = ({ cycloid, tooltipText }) => {
  // Update everything.
  const rerenderToggle = useContext(RerenderToggle);
  // Update only this component's tree
  const forceUpdate = useForceUpdate();

  return (
    <ControlSection>
      <Heading tooltipText={tooltipText}>Local</Heading>
      <ControlContainer>
        <Control
          paramName={"Rod Length Scale"}
          numberValue={cycloid.rodLengthScale}
          step={0.1}
          onDrag={(newValue: number) => {
            cycloid.rodLengthScale = newValue;
            rerenderToggle(RerenderReason.rodLength);
          }}
        />
        <Control
          paramName={"Cycloid Speed Scale"}
          onDrag={(newValue: number) => {
            cycloid.animationSpeedScale = newValue;
            rerenderToggle(RerenderReason.speedScale);
          }}
          numberValue={cycloid.animationSpeedScale}
          step={0.001}
        />
        <Control
          paramName={"Move Outside of Parent"}
          defaultBooleanValue={cycloid.moveOutSideOfParent}
          onClick={(newValue: boolean) => {
            cycloid.moveOutSideOfParent = newValue;
            rerenderToggle(RerenderReason.moveOutsideOfParent);
          }}
        />
        <Control
          paramName={"Radius"}
          numberValue={cycloid.radius}
          constraints={{ min: 10, max: Infinity }}
          step={1}
          onDrag={(newValue: number) => {
            cycloid.radius = newValue;
            rerenderToggle(RerenderReason.radius);
          }}
        />
        <h2 className="font-bold text-base mr-1.5">Rotation Direction: </h2>
        <div className="flex">
          <SelectionButton
            blur={cycloid.rotationDirection !== "clockwise"}
            text="Clockwise"
            onClick={() => {
              cycloid.rotationDirection = "clockwise";
              forceUpdate();
              rerenderToggle(RerenderReason.rotationDirection);
            }}
          />
          <SelectionButton
            blur={cycloid.rotationDirection !== "counterclockwise"}
            text="Counter Clockwise"
            onClick={() => {
              cycloid.rotationDirection = "counterclockwise";
              forceUpdate();
              rerenderToggle(RerenderReason.rotationDirection);
            }}
          />
        </div>
      </ControlContainer>
    </ControlSection>
  );
};

export default Local;
