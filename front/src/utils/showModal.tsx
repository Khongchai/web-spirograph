import React, { forwardRef, useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { createRoot } from "react-dom/client";

interface ModalProps {
  title: string;
  buttons: Array<{ text: string; onClick: VoidFunction }>;
}

export default function useShowModal(modalProps: ModalProps) {
  const [showModal, setShowModal] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showModal) {
      const rootElem = createRoot(document.getElementById("modal-root")!);
      rootElem.render(
        <Modal
          props={{
            ...modalProps,
            hideModal: () => setShowModal(false),
          }}
          ref={targetRef}
        />
      );
    } else {
      targetRef.current?.remove();
    }
  }, [showModal]);

  const modalControl = {
    showModal: () => setShowModal(true),
    hideModal: () => setShowModal(false),
  };

  return { modalControl };
}

const Modal = forwardRef(
  (
    {
      props: { buttons, title, hideModal },
    }: { props: ModalProps & { hideModal: VoidFunction } },
    ref: React.ForwardedRef<HTMLDivElement | null>
  ) => {
    return (
      <div
        className="fixed w-full h-full bg-purple-dark bg-opacity-80 top-0 left-0"
        onClick={() => hideModal()}
        ref={ref}
      >
        <div className="w-fit p-7 bg-purple-vivid ">Test Modal</div>
      </div>
    );
  }
);
