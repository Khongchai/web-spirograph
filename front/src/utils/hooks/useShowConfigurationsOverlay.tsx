import { MutableRefObject, useContext, useEffect, useState } from "react";
import { ConfigurationsRepository } from "../../classes/data/repository/configurationsRepository";
import { CycloidControlsAndCreatedDate } from "../../classes/domain/ConfigurationsAndDate";
import CycloidControls from "../../classes/domain/cycloidControls";
import { UITrigger } from "../../classes/domain/UITrigger";
import Button from "../../components/main/Shared/Button";
import ModalBackground from "../../components/main/Shared/ModalBackground";
import { RerenderToggle } from "../../contexts/rerenderToggle";
import { RerenderReason } from "../../types/contexts/rerenderReasons";

export default function useShowConfigurationsOverlay(
  cycloidControls: MutableRefObject<CycloidControls>
): UITrigger {
  const [show, setShow] = useState(false);
  const rerenderToggle = useContext(RerenderToggle);

  const [configurations, setConfigurations] =
    useState<CycloidControlsAndCreatedDate>();

  useEffect(() => {
    getConfigurations();
  }, [show]);

  // No need to show any loading screen.
  async function getConfigurations() {
    const configs = await ConfigurationsRepository.getSavedConfigurations();
    setConfigurations(configs);
  }

  function setCurrentCycloidControls(c: CycloidControls) {
    cycloidControls.current = c;
    rerenderToggle(RerenderReason.loadFromSave);
  }

  async function deleteConfiguration(id: string) {
    const configs = await ConfigurationsRepository.deleteSavedConfiguration({
      configurationId: id,
    });
    setConfigurations(configs);
  }

  return {
    UI: () =>
      show ? (
        <ModalBackground>
          {/* TODO this is temporary */}
          <ul>
            {configurations?.controls.map((config, i) => {
              return (
                <li
                  className="mb-4"
                  key={configurations?.createdDate[i]}
                  onClick={() => {
                    setCurrentCycloidControls(config);
                  }}
                >
                  <p className="mb-2 cursor-pointer">
                    {`${new Date(configurations?.createdDate[i])}`}
                  </p>
                  {/* Don't delete if there's only one left */}
                  {configurations.controls.length != 0 ? (
                    <button
                      className="py-2 px-4 bg-purple-vivid text-white text-sm font-semibold rounded-md shadow-lg hover:opacity-70 focus:outline-none"
                      onClick={() => {
                        deleteConfiguration(config.databaseId!);
                      }}
                    >
                      Delete
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <Button
            className="w-4/5 lg:w-fit"
            buttonText="Done"
            onClick={() => {
              setShow(false);
            }}
          />
        </ModalBackground>
      ) : (
        <></>
      ),
    trigger: (_show) => {
      setShow(_show);
    },
  };
}
