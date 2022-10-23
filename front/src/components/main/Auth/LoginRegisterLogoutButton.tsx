import { useContext } from "react";
import { userContext } from "../../../contexts/userContext";
import { useLoginModal } from "../Controls/UserModal";
import Button from "../Shared/Button";

export function LoginRegisterLogoutButton() {
  const user = useContext(userContext);
  const { UI: LoginModal, trigger } = useLoginModal();

  return (
    <div>
      <LoginModal />
      {!user ? (
        <Button buttonText="Register/Login" onClick={() => trigger(true)} />
      ) : (
        //TODO onclick
        <Button buttonText="Logout" />
      )}
    </div>
  );
}
