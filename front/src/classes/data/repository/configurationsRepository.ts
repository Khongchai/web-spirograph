import CycloidControls from "../../domain/cycloidControls";
import { BaseConfiguration } from "../../DTOInterfaces/BaseConfiguration";
import defaultCycloidControls from "../defaults/cycloidControls";
import { CycliodControlsBaseConfigurationMapper } from "../mapper/cycloidControlsBaseConfigurationMapper";
import { SaveConfigurationRequest } from "../request/saveConfigurationRequest";
import { SavedConfiguration } from "../response/GetSavedConfigurationsResponse";
import { SessionManager } from "../services/sessionManager";
import { BaseNetworkRepository } from "./baseNetworkRepository";
import NetworkErrorPropagatorDelegate from "./networkErrorPropagatorDelegate";

@NetworkErrorPropagatorDelegate("SavedConfigurationsRespotory", "static")
export class ConfigurationsRepository {
  static async saveConfiguration(
    cycloidControls: CycloidControls
  ): Promise<CycloidControls[]> {
    const resp = await BaseNetworkRepository.handle<SavedConfiguration[]>({
      path: "/config",
      method: "PUT",
      body: new SaveConfigurationRequest(
        CycliodControlsBaseConfigurationMapper.toBaseConfiguration(
          cycloidControls
        )
      ),
    });

    return resp.map((config) => {
      const baseConfig = JSON.parse(config.data) as BaseConfiguration;

      return CycliodControlsBaseConfigurationMapper.toCycloidControls(
        baseConfig
      );
    });
  }

  // TODO check if this is cached.
  static async getSavedConfigurations(): Promise<CycloidControls[]> {
    const defaultVal = [defaultCycloidControls];

    if (!SessionManager.getSessionToken()) {
      return defaultVal;
    }

    let resp: SavedConfiguration[];

    try {
      resp = await BaseNetworkRepository.handle<SavedConfiguration[]>({
        path: "/config",
        method: "GET",
      });
    } catch (_) {
      return defaultVal;
    }

    if (resp.length === 0) {
      return defaultVal;
    }

    return resp.map((config) => {
      const baseConfig = JSON.parse(config.data) as BaseConfiguration;

      return CycliodControlsBaseConfigurationMapper.toCycloidControls(
        baseConfig
      );
    });
  }
}
