import CycloidControls from "../../../classes/domain/cycloidControls";
import CycloidParams from "../../../classes/domain/CycloidParams";
import { RerenderReason } from "../../../types/contexts/rerenderReasons";
import InstantDrawCycloid from "../models/Cycloid";
import { DrawerData } from "../models/DrawerData";


// A mapper that spits out InstantDrawCycloid
export class InstantDrawCycloidMapper {
  // TODO very likely it's this mapper here.
  static fromCycloidParams(cycloidParams: CycloidParams[]) {
    const instantDrawCycloids = cycloidParams.map((param) => {
      const {
        animationSpeedScale,
        moveOutSideOfParent,
        radius,
        rodLengthScale,
        rotationDirection,
      } = param;
      return {
        isClockwise: rotationDirection === "clockwise",
        isOutsideOfParent: moveOutSideOfParent,
        radius,
        rodLength: rodLengthScale * radius,
        thetaScale: animationSpeedScale ?? 1,
      } as InstantDrawCycloid;
    });

    return instantDrawCycloids;
  }

  /**
   * Responsible for making sure that the field transfer to the worker is really the changed field.
   *
   * This function accepts the current cycloid controls (presumable the newest one with the latest state change)
   * and the latest change reason. It then looks
   *
   * TODO map this and all actions that trigger rerender
   */
  static fromReasonAndControls(
    cycloidControls: CycloidControls,
    reason: RerenderReason
  ): InstantDrawCycloid[] | DrawerData | undefined {
    const _reason = reason;
    const params = cycloidControls.cycloidManager.allCycloidParams;
    switch (_reason) {
      case RerenderReason.addOrRemoveCycloid:
        return InstantDrawCycloidMapper.fromCycloidParams(params);

      case RerenderReason.changedFocusedCycloid:
        return InstantDrawCycloidMapper.fromCycloidParams(
          cycloidControls.cycloidManager.getAllAncestors(
            cycloidControls.currentCycloidId
          )
        );

      case RerenderReason.moveOutsideOfParent:
        return params.map(({ moveOutSideOfParent }) => {
          return {
            isOutsideOfParent: moveOutSideOfParent,
          } as InstantDrawCycloid;
        });

      case RerenderReason.pan:
        throw new Error("Unhandled RerenderReason.case");

      case RerenderReason.radius:
        return params.map(({ radius }) => {
          return {
            radius: radius,
          } as InstantDrawCycloid;
        });

      case RerenderReason.resize:
        break;

      case RerenderReason.rodLength:
        return params.map(({ rodLengthScale, radius }) => {
          return {
            rodLength: rodLengthScale * radius,
          } as InstantDrawCycloid;
        });

      case RerenderReason.rotationDirection:
        return params.map(({ rotationDirection }) => {
          return {
            isClockwise: rotationDirection === "clockwise",
          } as InstantDrawCycloid;
        });

      case RerenderReason.speedScale:
        return params.map(({ animationSpeedScale }) => {
          return {
            thetaScale: animationSpeedScale,
          } as InstantDrawCycloid;
        });
      default:
        return;
    }

    return [];
  }
}
