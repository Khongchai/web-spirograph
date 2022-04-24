import { useContext } from "react";
import CycloidParams from "../../classes/CycloidParams";
import { RerenderToggle } from "../../contexts/rerenderToggle";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
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
            rerenderToggle();
          }}
        />
        <Control
          paramName={"Cycloid Speed Scale"}
          onDrag={(newValue: number) => {
            cycloid.animationSpeedScale = newValue;
            rerenderToggle();
          }}
          numberValue={cycloid.animationSpeedScale}
          step={0.01}
        />
        <Control
          paramName={"Move Outside of Parent"}
          defaultBooleanValue={cycloid.moveOutSideOfParent}
          onClick={(newValue: boolean) => {
            cycloid.moveOutSideOfParent = newValue;
            rerenderToggle();
          }}
        />
        <Control
          paramName={"Radius"}
          numberValue={cycloid.radius}
          constraints={{ min: 10, max: Infinity }}
          step={1}
          onDrag={(newValue: number) => {
            cycloid.radius = newValue;
            rerenderToggle();
          }}
        />
        <h2 className="font-bold text-base mr-1.5">Rotation Direction: </h2>
        <div className="flex">
          <SelectionButton
            blur={cycloid.rotationDirection !== "clockwise"}
            innerHTML="Clockwise"
            onClick={() => {
              cycloid.rotationDirection = "clockwise";
              forceUpdate();
              rerenderToggle();
            }}
          />
          <SelectionButton
            blur={cycloid.rotationDirection !== "counterclockwise"}
            innerHTML="Counter Clockwise"
            onClick={() => {
              cycloid.rotationDirection = "counterclockwise";
              forceUpdate();
              rerenderToggle();
            }}
          />
        </div>
      </ControlContainer>
    </ControlSection>
  );
};

export default Local;
