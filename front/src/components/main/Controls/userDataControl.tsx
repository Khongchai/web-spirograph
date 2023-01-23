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
  cycloidControls: React.MutableRefObject<CycloidControls>;
}) {
  const user = useContext(userContext);

  const { UI: LoginModal, trigger: loginModalTrigger } = useLoginModal({
    cycloidControls: cycloidControls.current,
  });

  async function onSaveConfigurationClicked() {
    await ConfigurationsRepository.saveConfiguration(cycloidControls.current);
    return;

    if (user) {
      await ConfigurationsRepository.saveConfiguration(cycloidControls.current);
      alert("Data saved successfully");
    } else {
      loginModalTrigger(true);
    }
  }

  const { UI: ShowConfigurationsOverlay, trigger: showConfigurationsTrigger } =
    useShowConfigurationsOverlay(cycloidControls);
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
        />
        <Button
          buttonText="Show Saved Configurations"
          onClick={onShowConfigurationsClicked}
        />
      </SettingsContainer>
    </ControlSection>
  );
}
