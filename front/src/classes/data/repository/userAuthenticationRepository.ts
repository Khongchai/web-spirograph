import { BASE_API_ENDPOINT } from "../../../environmentVariables";
import CycloidControls from "../../domain/cycloidControls";
import { User } from "../../domain/userData/User";
import { BoundingCircleInterface } from "../../DTOInterfaces/BoundingCircleInterface";
import { BaseConfiguration } from "../../DTOInterfaces/ConfigurationInterface";
import { BaseNetworkRepository } from "./baseNetworkRepository";

interface LoginInterface {
  email: string;
}

interface RegisterInterface {
  email: string;
  username: string;
  cycloidControls: CycloidControls;
}

export class UserAuthenticationRepository extends BaseNetworkRepository {
  // TODO Make this work without any otp for now, and then open a websocket and wait for a response (after otp validation).
  static async loginOrRegister({
    email,
    cycloidControls,
    username,
  }: LoginInterface & Partial<RegisterInterface>): Promise<User | null> {
    // We need a separate mapper because without one, changing one of the properties would instantly break,
    // the api.

    const baseConfiguration = cycloidControls
      ? ({
          animationState: cycloidControls?.animationState,
          clearTracedPathOnParamsChange:
            cycloidControls?.clearTracedPathOnParamsChange,
          currentCycloidId: cycloidControls?.currentCycloidId,
          cycloids: cycloidControls?.cycloidManager.allCycloidParams.map(
            (cycloid) => {
              return {
                animationSpeedScale: cycloid.animationSpeedScale,
                boundingColor: cycloid.boundingColor,
                moveOutSideOfParent: cycloid.moveOutSideOfParent,
                radius: cycloid.radius,
                rodLengthScale: cycloid.rodLengthScale,
                rotationDirection: cycloid.rotationDirection,
              };
            }
          ),
          globalTimeStepScale: cycloidControls?.globalTimeStepScale,
          mode: cycloidControls?.mode,
          outermostBoundingCircle: {
            ...cycloidControls?.outermostBoundingCircle,
          } as BoundingCircleInterface,
          programOnly: cycloidControls?.programOnly,
          scaffold: cycloidControls?.scaffold,
          showAllCycloids: cycloidControls?.showAllCycloids,
          traceAllCycloids: cycloidControls?.traceAllCycloids,
        } as BaseConfiguration)
      : null;

    const res = await fetch(`${BASE_API_ENDPOINT}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        baseConfiguration: baseConfiguration,
      }),
    });

    if (!res.ok) {
      //TODO error handling.
    }

    const json = await res.json();

    return Promise.resolve(null);
  }
}
