import { User } from "../../domain/userData/User";

export interface LogInOrRegisterOtpResponse {
  email: string;
  accessToken: string;
  username: string;
  savedConfigurations: string[];
}
