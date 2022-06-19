import { BaseConfiguration } from "../../interfaces/ConfigurationInterface";

interface SaveConfigurationRequest {
  /**
   * JSON-serialized configuration.
   */
  serializedConfiguration: string;
}
