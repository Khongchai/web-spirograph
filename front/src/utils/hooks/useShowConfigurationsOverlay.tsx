import { useContext, useEffect, useState } from "react";
import { ConfigurationsRepository } from "../../classes/data/repository/configurationsRepository";
import { CycloidControlsAndCreatedDate } from "../../classes/domain/ConfigurationsAndDate";
import { UITrigger } from "../../classes/domain/UITrigger";
import Button from "../../components/main/Shared/Button";
import ModalBackground from "../../components/main/Shared/ModalBackground";

export default function useShowConfigurationsOverlay(): UITrigger {
  const [show, setShow] = useState(false);

  const [configurations, setConfigurations] =
    useState<CycloidControlsAndCreatedDate>();

  useEffect(() => {
    // TODO cache this.
    if (show) {
      getConfigurations();
    }
  }, [show]);

  async function getConfigurations() {
    const configs = await ConfigurationsRepository.getSavedConfigurations();
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
                <li key={configurations?.createdDate[i]} onClick={() => {}}>
                  <p>
                    This is a temp list:
                    {`${new Date(configurations?.createdDate[i])}`}
                  </p>
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
