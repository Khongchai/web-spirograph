import BoundingCircle from "../../domain/BoundingCircle";
import CycloidControls from "../../domain/cycloidControls";
import { User } from "../../domain/userData/User";
import { BoundingCircleInterface } from "../../DTOInterfaces/BoundingCircleInterface";
import { BaseConfiguration } from "../../DTOInterfaces/ConfigurationInterface";
import { LoginOrRegisterRequest } from "../request/logInOrRegisterRequest";
import { LogInOrRegisterOtpResponse } from "../response/loginOrRegisterOtpResponse";
import { BaseNetworkRepository } from "./baseNetworkRepository";
import NetworkErrorPropagatorDelegate from "./networkErrorPropagatorDelegate";
import { SessionManager } from "../services/sessionManager";

interface LoginInterface {
  email: string;
  enteredOtp: string;
}

interface RegisterInterface {
  email: string;
  username: string;
  cycloidControls: CycloidControls;
  enteredOtp: string;
}

interface OtpRequestsInterface {
  email: string;
}

@NetworkErrorPropagatorDelegate("UserAuthenticationRepository", "static")
export class UserAuthenticationRepository extends BaseNetworkRepository {
  static async loginOrRegisterRequest({
    email,
    cycloidControls,
    username,
    enteredOtp,
  }: LoginInterface & Partial<RegisterInterface>): Promise<User> {
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

    const json =
      await UserAuthenticationRepository.handle<LogInOrRegisterOtpResponse>({
        path: "/auth",
        method: "POST",
        body: {
          email,
          otpCode: enteredOtp,
          serializedConfiguration: JSON.stringify(baseConfiguration),
          username,
        } as LoginOrRegisterRequest,
      });

    SessionManager.sessionToken = json.accessToken;

    const user = new User({
      currentConfigs: json.savedConfigurations.map((config) => {
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
        } = JSON.parse(config) as BaseConfiguration;
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
      }),
      email: json.email,
      username: json.username,
    });

    return user;
  }

  static async otpRequest({ email }: OtpRequestsInterface): Promise<void> {
    await UserAuthenticationRepository.handle<void>({
      path: "/otp",
      method: "POST",
      body: { email },
    });
  }
}
