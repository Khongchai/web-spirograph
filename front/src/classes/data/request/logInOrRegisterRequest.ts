import { BaseConfiguration } from "../../interfaces/ConfigurationInterface";

interface SaveConfigurationRequest {
  /**
   * JSON-serialized configuration.
   */
  serializedConfiguration: string;

  email: string;

  // If logging in, username is not needed.
  username?: string;
}
