import CycloidParams from "../../types/cycloidParams";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
import Content from "./shared/content";
import ContentContainer from "./shared/ContentContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import SelectionButton from "./shared/SelectionButton";

const Local: React.FC<{ cycloid: CycloidParams }> = ({ cycloid }) => {
  const forceUpdate = useForceUpdate();

  return (
    <ControlSection>
      <Heading>Local</Heading>
      <ContentContainer>
        <Content
          paramName={"Rod Length Scale"}
          value={cycloid.rodLengthScale}
        ></Content>
        <Content
          paramName={"Cycloid Speed Scale"}
          value={cycloid.animationSpeedScale}
        ></Content>
        <Content
          paramName={"Move Outside of Parent"}
          value={cycloid.moveOutSideOfParent}
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
      </ContentContainer>
    </ControlSection>
  );
};

export default Local;
