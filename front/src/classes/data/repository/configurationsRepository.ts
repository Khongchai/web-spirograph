import BoundingCircle from "../../domain/BoundingCircle";
import CycloidControls from "../../domain/cycloidControls";
import { BaseConfiguration } from "../../DTOInterfaces/ConfigurationInterface";
import { SavedConfiguration } from "../response/GetSavedConfigurationsResponse";
import { BaseNetworkRepository } from "./baseNetworkRepository";
import NetworkErrorPropagatorDelegate from "./networkErrorPropagatorDelegate";
import { UserAuthenticationRepository } from "./userAuthenticationRepository";

@NetworkErrorPropagatorDelegate("SavedConfigurationsRespotory", "static")
export class ConfigurationsRepository extends BaseNetworkRepository {
  static async getSavedConfigurations(): Promise<CycloidControls[]> {
    const json = await UserAuthenticationRepository.handle<
      SavedConfiguration[]
    >({
      path: "/config",
      method: "GET",
    });

    return json.map((config) => {
      const {
        animationState,
        clearTracedPathOnParamsChange,
        currentCycloidId,
        cycloids,
        globalTimeStepScale,
        mode,
        outermostBoundingCircle,
        programOnly,
        scaffold,
        showAllCycloids,
        traceAllCycloids,
        //TODO this might not work because the endpoint might return our data as a JSON object.
      } = JSON.parse(config.data) as BaseConfiguration;
      return new CycloidControls({
        animationState,
        clearTracedPathOnParamsChange,
        currentCycloidId,
        cycloids,
        globalTimeStepScale,
        mode,
        outermostBoundingCircle: new BoundingCircle(
          outermostBoundingCircle.centerPoint,
          outermostBoundingCircle.radius,
          outermostBoundingCircle.boundingColor
        ),
        programOnly,
        scaffold,
        showAllCycloids,
        traceAllCycloids,
      });
    });
  }
}
