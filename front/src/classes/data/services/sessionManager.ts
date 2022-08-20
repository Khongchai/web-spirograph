import { User } from "../../domain/userData/User";

export class SessionManager {
  static sessionToken: string | null = null;

  static user: User | null = null;
}
