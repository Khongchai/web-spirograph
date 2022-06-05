import Button from "../Shared/Button";
import SettingsContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";

export function UserDataControl({ tooltipText }: { tooltipText: string }) {
  return (
    <ControlSection>
      <SettingsContainer>
        <Heading tooltipText={tooltipText}>Save Config</Heading>
        <Button
          buttonText="Save Config"
          onClick={() => console.log("TODO")}
        ></Button>
      </SettingsContainer>
    </ControlSection>
  );
}
