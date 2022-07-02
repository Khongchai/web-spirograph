import { BaseConfiguration } from "../../DTOInterfaces/ConfigurationInterface";

interface SaveConfigurationRequest {
  /**
   * JSON-serialized configuration.
   */
  serializedConfiguration: string;
}
