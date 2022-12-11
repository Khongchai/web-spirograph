export interface MeResponse {
  user: {
    id: string;
    email: string;
    savedConfigurations: string[];
  };
  newToken: string;
}
