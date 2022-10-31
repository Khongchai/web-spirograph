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
    getConfigurations();
  }, []);

  async function getConfigurations() {
    const configs = await ConfigurationsRepository.getSavedConfigurations();
    setConfigurations(configs);
  }

  return {
    UI: () =>
      show ? (
        <ModalBackground>
          {/* TODO this is temporary */}
          <li>
            {configurations?.controls.map((config, i) => {
              return (
                <ul
                  onClick={() => {
                    console.log("clicked");
                  }}
                >
                  <p>
                    This is a temp list:
                    {`${new Date(configurations?.createdDate[i])}`}
                  </p>
                </ul>
              );
            })}
          </li>
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
