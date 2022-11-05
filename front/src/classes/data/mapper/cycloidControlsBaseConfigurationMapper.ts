import BoundingCircle from "../../domain/BoundingCircle";
import CycloidControls from "../../domain/cycloidControls";
import { BaseConfiguration } from "../../DTOInterfaces/BaseConfiguration";

export class CycliodControlsBaseConfigurationMapper {
  static toBaseConfiguration(controls: CycloidControls): BaseConfiguration {
    return new BaseConfiguration({
      animationState: controls.animationState,
      clearTracedPathOnParamsChange: controls.clearTracedPathOnParamsChange,
      currentCycloidId: controls.currentCycloidId,
      cycloids: controls.cycloidManager.allCycloidParams,
      globalTimeStepScale: controls.globalTimeStepScale,
      mode: controls.mode,
      outermostBoundingCircle: controls.outermostBoundingCircle,
      programOnly: controls.programOnly,
      scaffold: controls.scaffold,
      showAllCycloids: controls.showAllCycloids,
      traceAllCycloids: controls.traceAllCycloids,
    });
  }

  static toCycloidControls({
    config,
    id,
  }: {
    config: BaseConfiguration;
    id: string;
  }): CycloidControls {
    return new CycloidControls({
      databaseId: id,
      animationState: config.animationState,
      clearTracedPathOnParamsChange: config.clearTracedPathOnParamsChange,
      currentCycloidId: config.currentCycloidId,
      cycloids: config.cycloids,
      globalTimeStepScale: config.globalTimeStepScale,
      mode: config.mode,
      outermostBoundingCircle: new BoundingCircle(
        config.outermostBoundingCircle.centerPoint,
        config.outermostBoundingCircle.radius,
        config.outermostBoundingCircle.boundingColor
      ),
      programOnly: config.programOnly,
      scaffold: config.scaffold,
      showAllCycloids: config.showAllCycloids,
      traceAllCycloids: config.traceAllCycloids,
    });
  }
}
