import { CycloidControlsAndCreatedDate } from "../../domain/ConfigurationsAndDate";
import CycloidControls from "../../domain/cycloidControls";
import { BaseConfiguration } from "../../DTOInterfaces/BaseConfiguration";
import defaultCycloidControls from "../defaults/cycloidControls";
import { CycliodControlsBaseConfigurationMapper } from "../mapper/cycloidControlsBaseConfigurationMapper";
import { DeleteConfigurationRequest } from "../request/deleteConfigurationRequest";
import { SaveConfigurationRequest } from "../request/saveConfigurationRequest";
import { deleteConfigurationResponse } from "../response/DeleteConfigurationResponse";
import { GetSavedConfigurationsResponse } from "../response/GetSavedConfigurationsResponse";
import { SavedConfiguration } from "../response/SavedConfiguration";
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

    const returnVal: CycloidControlsAndCreatedDate =
      this.mappers.savedConfigurationsToCycloidcontrolsAndCreatedDate(resp);

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

    const returnVal: CycloidControlsAndCreatedDate =
      this.mappers.savedConfigurationsToCycloidcontrolsAndCreatedDate(resp);

    return returnVal;
  }

  private static mappers = {
    savedConfigurationsToCycloidcontrolsAndCreatedDate: (
      configs: SavedConfiguration[]
    ) => {
      const returnVal: CycloidControlsAndCreatedDate = {
        controls: [],
        createdDate: [],
      };
      for (const val of configs) {
        const baseConfig = JSON.parse(val.data) as BaseConfiguration;
        const mappedConfig =
          CycliodControlsBaseConfigurationMapper.toCycloidControls(baseConfig);

        returnVal.controls.push(mappedConfig);
        returnVal.createdDate.push(val.date);
      }

      return returnVal;
    },
  };
}
