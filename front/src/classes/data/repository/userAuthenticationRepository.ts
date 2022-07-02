import { REACT_APP_BASE_API_ENDPOINT } from "../../../environmentVariables";
import CycloidControls from "../../domain/cycloidControls";
import { BoundingCircleInterface } from "../../DTOInterfaces/BoundingCircleInterface";
import { BaseConfiguration } from "../../DTOInterfaces/ConfigurationInterface";
import { LogInOrRegisterOtpResponse } from "../response/loginOrRegisterOtpResponse";
import { BaseNetworkRepository } from "./baseNetworkRepository";
import GenericRepositoryModalErrorHandling from "./genericModalErrorHandling";

interface LoginInterface {
  email: string;
}

interface RegisterInterface {
  email: string;
  username: string;
  cycloidControls: CycloidControls;
}

@GenericRepositoryModalErrorHandling("UserAuthenticationRepository", "static")
export class UserAuthenticationRepository extends BaseNetworkRepository {
  // TODO Make this work without any otp for now, and then open a websocket and wait for a response (after otp validation).
  static async loginOrRegisterOtpRequest({
    email,
    cycloidControls,
    username,
  }: LoginInterface & Partial<RegisterInterface>): Promise<string> {
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

    const url = `http://${REACT_APP_BASE_API_ENDPOINT}/user`;
    const res = await fetch(url, {
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
      console.error(
        `Operation failed for ${REACT_APP_BASE_API_ENDPOINT}, ${res.status}`
      );
      console.error(res);
      throw new Error(res.statusText);
    }

    const json = (await res.json()) as LogInOrRegisterOtpResponse;

    return json.otpToken;
  }
}
