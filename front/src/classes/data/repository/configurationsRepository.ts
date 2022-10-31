import { CycloidControlsAndCreatedDate } from "../../domain/ConfigurationsAndDate";
import CycloidControls from "../../domain/cycloidControls";
import { BaseConfiguration } from "../../DTOInterfaces/BaseConfiguration";
import defaultCycloidControls from "../defaults/cycloidControls";
import { CycliodControlsBaseConfigurationMapper } from "../mapper/cycloidControlsBaseConfigurationMapper";
import { SaveConfigurationRequest } from "../request/saveConfigurationRequest";
import { GetSavedConfigurationsResponse } from "../response/GetSavedConfigurationsResponse";
import { SessionManager } from "../services/sessionManager";
import { BaseNetworkRepository } from "./baseNetworkRepository";
import NetworkErrorPropagatorDelegate from "./networkErrorPropagatorDelegate";

@NetworkErrorPropagatorDelegate("SavedConfigurationsRespotory", "static")
export class ConfigurationsRepository {
  static async saveConfiguration(
    cycloidControls: CycloidControls
  ): Promise<CycloidControls[]> {
    const resp =
      await BaseNetworkRepository.handle<GetSavedConfigurationsResponse>({
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
  static async getSavedConfigurations(): Promise<CycloidControlsAndCreatedDate> {
    const defaultVal = {
      controls: [defaultCycloidControls],
      createdDate: [Date.now()],
    };

    if (!SessionManager.getSessionToken()) {
      return defaultVal;
    }

    let resp: GetSavedConfigurationsResponse;

    try {
      resp = await BaseNetworkRepository.handle<GetSavedConfigurationsResponse>(
        {
          path: "/config",
          method: "GET",
        }
      );
    } catch (_) {
      return defaultVal;
    }

    if (resp.length === 0) {
      return defaultVal;
    }

    const returnVal: CycloidControlsAndCreatedDate = {
      controls: [],
      createdDate: [],
    };
    for (const val of resp) {
      const baseConfig = JSON.parse(val.data) as BaseConfiguration;
      const mappedConfig =
        CycliodControlsBaseConfigurationMapper.toCycloidControls(baseConfig);

      returnVal.controls.push(mappedConfig);
      returnVal.createdDate.push(val.date);
    }

    return returnVal;
  }
}
