import { createContext } from "react";
import { User } from "../classes/domain/userData/User";

export const userContext = createContext<User | null>(null);
