import { useState } from "react";
import { UITrigger } from "../../classes/domain/UITrigger";
import ModalBackground from "../../components/main/Shared/ModalBackground";

export default function useShowConfigurationsOverlay(): UITrigger {
  const [show, setShow] = useState(false);

  return {
    UI: () =>
      show ? (
        <ModalBackground>
          <div>Hello</div>
        </ModalBackground>
      ) : (
        <></>
      ),
    trigger: (_show) => {
      setShow(_show);
    },
  };
}
