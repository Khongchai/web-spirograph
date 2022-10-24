import { useContext } from "react";
import { userContext } from "../../../contexts/userContext";
import Button from "../Shared/Button";
import SettingsContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import { useLoginModal } from "./UserModal";

export function UserDataControl({ tooltipText }: { tooltipText: string }) {
  const user = useContext(userContext);

  const { UI: LoginModal, trigger } = useLoginModal();

  function onSaveConfigurationClicked() {
    trigger(true);
  }

  return (
    <ControlSection>
      <SettingsContainer>
        <LoginModal />
        <Heading tooltipText={tooltipText}>Config</Heading>
        <Button
          buttonText="Save Config"
          onClick={onSaveConfigurationClicked}
        ></Button>
        {user!! ? (
          <Button
            buttonText="Show Saved Configurations"
            onClick={() => {}}
          ></Button>
        ) : (
          <></>
        )}
      </SettingsContainer>
    </ControlSection>
  );
}
