import { User } from "../../domain/userData/User";

export class SessionManager {
  private static sessionTokenKey = "session";

  static getSessionToken(): string | null {
    return localStorage.getItem(SessionManager.sessionTokenKey);
  }

  static setSessionToken(value: string | null): void {
    if (value) {
      localStorage.setItem(SessionManager.sessionTokenKey, value);
    } else {
      localStorage.removeItem(SessionManager.sessionTokenKey);
    }
  }

  static user: User | null = null;
}
