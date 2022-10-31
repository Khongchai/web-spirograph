import { useContext } from "react";
import { ConfigurationsRepository } from "../../../classes/data/repository/configurationsRepository";
import CycloidControls from "../../../classes/domain/cycloidControls";
import { userContext } from "../../../contexts/userContext";
import useShowConfigurationsOverlay from "../../../utils/hooks/useShowConfigurationsOverlay";
import Button from "../Shared/Button";
import SettingsContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import { useLoginModal } from "./UserModal";

export function UserDataControl({
  tooltipText,
  cycloidControls,
}: {
  tooltipText: string;
  cycloidControls: CycloidControls;
}) {
  const user = useContext(userContext);

  const { UI: LoginModal, trigger: loginModalTrigger } = useLoginModal({
    cycloidControls,
  });

  async function onSaveConfigurationClicked() {
    if (user) {
      await ConfigurationsRepository.saveConfiguration(cycloidControls);
      alert("Data saved successfully");
    } else {
      loginModalTrigger(true);
    }
  }

  const { UI: ShowConfigurationsOverlay, trigger: showConfigurationsTrigger } =
    useShowConfigurationsOverlay();
  function onShowConfigurationsClicked() {
    showConfigurationsTrigger(true);
  }

  return (
    <ControlSection>
      <SettingsContainer>
        <LoginModal />
        <ShowConfigurationsOverlay />
        <Heading tooltipText={tooltipText}>Config</Heading>
        <Button
          buttonText="Save Config"
          onClick={onSaveConfigurationClicked}
        ></Button>
        {user!! ? (
          <Button
            buttonText="Show Saved Configurations"
            onClick={onShowConfigurationsClicked}
          />
        ) : (
          <></>
        )}
      </SettingsContainer>
    </ControlSection>
  );
}
