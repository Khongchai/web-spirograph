import { useContext } from "react";
import { userContext } from "../../../contexts/userContext";
import Button from "../Shared/Button";

export function LoginRegisterLogoutButton() {
  const user = useContext(userContext);

  return !user ? <Button buttonText="Register/Login" /> : <Button buttonText="Logout"/>;
}
