import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../../contexts/userContext";

export function UserModal({ onBgClicked }: { onBgClicked: VoidFunction }) {
  const user = useContext(userContext);

  return user ? (
    <LoginModal onBgClicked={onBgClicked} />
  ) : (
    <RegisterModal onBgClicked={onBgClicked} />
  );
}

export function RegisterModal({ onBgClicked }: { onBgClicked: VoidFunction }) {
  return (
    <ModalBackground onBgClicked={onBgClicked}>
      <div>Register Modal</div>
    </ModalBackground>
  );
}

export function LoginModal({ onBgClicked }: { onBgClicked: VoidFunction }) {
  return (
    <ModalBackground onBgClicked={onBgClicked}>
      <div>Login Modal</div>
    </ModalBackground>
  );
}

interface ModalBackgroundProps {
  children: React.ReactNode;
  onBgClicked: () => void;
}

function ModalBackground({ children, onBgClicked }: ModalBackgroundProps) {
  return (
    <div className="fixed w-full h-full grid place-items-center top-0 left-0">
      <div className="z-20">{children}</div>
      <div
        className="fixed w-full h-full bg-purple-dark opacity-80 top-0 left-0 z-1"
        onClick={onBgClicked}
      />
    </div>
  );
}
