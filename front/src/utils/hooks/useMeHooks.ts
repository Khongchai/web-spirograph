import { useContext, useEffect, useState } from "react";
import { UserAuthenticationRepository } from "../../classes/data/repository/userAuthenticationRepository";
import CycloidControls from "../../classes/domain/cycloidControls";
import { User } from "../../classes/domain/userData/User";
import { setUserContext, userContext } from "../../contexts/userContext";

// Call the me function to findout who the current user is.
export default function useMeHooks(): {
  done: boolean;
} {
  const [done, setDone] = useState(false);
  const setUser = useContext(setUserContext);

  useEffect(() => {
    me();
  }, []);

  async function me() {
    setDone(false);

    const user: User | null = await UserAuthenticationRepository.me();
    setUser(user);

    setDone(true);
  }

  return { done };
}
