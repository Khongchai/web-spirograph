import CycloidControls from "../../domain/cycloidControls";
import { BaseConfiguration } from "../../DTOInterfaces/BaseConfiguration";
import { CycliodControlsBaseConfigurationMapper } from "../mapper/cycloidControlsBaseConfigurationMapper";
import { SaveConfigurationRequest } from "../request/saveConfigurationRequest";
import { SavedConfiguration } from "../response/GetSavedConfigurationsResponse";
import { BaseNetworkRepository } from "./baseNetworkRepository";
import NetworkErrorPropagatorDelegate from "./networkErrorPropagatorDelegate";

@NetworkErrorPropagatorDelegate("SavedConfigurationsRespotory", "static")
export class ConfigurationsRepository {
  static async saveConfiguration(
    cycloidControls: CycloidControls
  ): Promise<CycloidControls[]> {
    const json = await BaseNetworkRepository.handle<SavedConfiguration[]>({
      path: "/config",
      method: "PUT",
      body: JSON.stringify({
        newconfig: new SaveConfigurationRequest(
          CycliodControlsBaseConfigurationMapper.toBaseConfiguration(
            cycloidControls
          )
        ),
      }),
    });

    return json.map((config) => {
      const baseConfig = JSON.parse(config.data) as BaseConfiguration;

      return CycliodControlsBaseConfigurationMapper.toCycloidControls(
        baseConfig
      );
    });
  }

  static async getSavedConfigurations(): Promise<CycloidControls[]> {
    const json = await BaseNetworkRepository.handle<SavedConfiguration[]>({
      path: "/config",
      method: "GET",
    });

    return json.map((config) => {
      const baseConfig = JSON.parse(config.data) as BaseConfiguration;

      return CycliodControlsBaseConfigurationMapper.toCycloidControls(
        baseConfig
      );
    });
  }
}
