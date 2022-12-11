import { CycloidControlsAndCreatedDate } from "../../domain/ConfigurationsAndDate";
import CycloidControls from "../../domain/cycloidControls";
import { BaseConfiguration } from "../../DTOInterfaces/BaseConfiguration";
import defaultCycloidControls from "../defaults/cycloidControls";
import { CycliodControlsBaseConfigurationMapper } from "../mapper/cycloidControlsBaseConfigurationMapper";
import { DeleteConfigurationRequest } from "../request/deleteConfigurationRequest";
import { SaveConfigurationRequest } from "../request/saveConfigurationRequest";
import { deleteConfigurationResponse } from "../response/DeleteConfigurationResponse";
import { GetSavedConfigurationsResponse } from "../response/GetSavedConfigurationsResponse";
import { SessionManager } from "../services/sessionManager";
import { BaseNetworkRepository } from "./baseNetworkRepository";
import NetworkErrorPropagatorDelegate from "./networkErrorPropagatorDelegate";

@NetworkErrorPropagatorDelegate("SavedConfigurationsRespotory", "static")
export class ConfigurationsRepository {
  static async saveConfiguration(
    cycloidControls: CycloidControls
  ): Promise<CycloidControlsAndCreatedDate> {
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

    const returnVal: CycloidControlsAndCreatedDate = {
      controls: [],
      createdDate: [],
    };
    for (const val of resp) {
      const baseConfig = JSON.parse(val.data) as BaseConfiguration;
      const mappedConfig =
        CycliodControlsBaseConfigurationMapper.toCycloidControls({
          config: baseConfig,
          id: val.id,
        });

      returnVal.controls.push(mappedConfig);
      returnVal.createdDate.push(val.date);
    }

    return returnVal;
  }

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
      SessionManager.setSessionToken(null);
      return defaultVal;
    }

    const returnVal: CycloidControlsAndCreatedDate = {
      controls: [],
      createdDate: [],
    };

    // Save a default one.
    if (resp.length === 0) {
      const resp = await ConfigurationsRepository.saveConfiguration(
        defaultCycloidControls
      );
      return resp;
    }

    for (const val of resp) {
      const baseConfig = JSON.parse(val.data) as BaseConfiguration;
      const mappedConfig =
        CycliodControlsBaseConfigurationMapper.toCycloidControls({
          config: baseConfig,
          id: val.id,
        });

      returnVal.controls.push(mappedConfig);
      returnVal.createdDate.push(val.date);
    }

    return returnVal;
  }

  static async deleteSavedConfiguration({
    configurationId,
  }: {
    configurationId: string;
  }): Promise<CycloidControlsAndCreatedDate> {
    const resp =
      await BaseNetworkRepository.handle<deleteConfigurationResponse>({
        method: "DELETE",
        path: "/config",
        body: {
          configurationId,
        } as DeleteConfigurationRequest,
      });

    const returnVal: CycloidControlsAndCreatedDate = {
      controls: [],
      createdDate: [],
    };
    for (const val of resp) {
      const baseConfig = JSON.parse(val.data) as BaseConfiguration;
      const mappedConfig =
        CycliodControlsBaseConfigurationMapper.toCycloidControls({
          config: baseConfig,
          id: val.id,
        });

      returnVal.controls.push(mappedConfig);
      returnVal.createdDate.push(val.date);
    }

    return returnVal;
  }
}
