import CycloidParams from "../../types/cycloidParams";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
import Control from "./shared/control";
import ControlContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import SelectionButton from "./shared/SelectionButton";

const Local: React.FC<{ cycloid: CycloidParams }> = ({ cycloid }) => {
  const forceUpdate = useForceUpdate();

  return (
    <ControlSection>
      <Heading>Local</Heading>
      <ControlContainer>
        <Control
          paramName={"Rod Length Scale"}
          numberValue={cycloid.rodLengthScale}
          onDrag={(newValue: number) => {
            cycloid.rodLengthScale = newValue;
          }}
        ></Control>
        <Control
          paramName={"Cycloid Speed Scale"}
          onDrag={(newValue: number) =>
            (cycloid.animationSpeedScale = newValue)
          }
          numberValue={cycloid.animationSpeedScale}
        ></Control>
        <Control
          paramName={"Move Outside of Parent"}
          booleanValue={cycloid.moveOutSideOfParent}
          onClick={(newValue: boolean) => {
            cycloid.moveOutSideOfParent = newValue;
          }}
        />
        {/* TODO refactor this into content? */}
        <h2 className="font-bold text-base mr-1.5">Rotation Direction: </h2>
        <div className="flex">
          <SelectionButton
            blur={cycloid.rotationDirection !== "clockwise"}
            innerHTML="Clockwise"
            onClick={() => {
              cycloid.rotationDirection = "clockwise";
              forceUpdate();
            }}
          />
          <SelectionButton
            blur={cycloid.rotationDirection !== "counterclockwise"}
            innerHTML="Counter Clockwise"
            onClick={() => {
              cycloid.rotationDirection = "counterclockwise";
              forceUpdate();
            }}
          />
        </div>
      </ControlContainer>
    </ControlSection>
  );
};

export default Local;
