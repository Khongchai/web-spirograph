import CycloidControls from "../../domain/cycloidControls";
import { User } from "../../domain/userData/User";
import { BoundingCircleInterface } from "../../DTOInterfaces/BoundingCircleInterface";
import { BaseConfiguration } from "../../DTOInterfaces/BaseConfiguration";
import { LoginOrRegisterRequest } from "../request/logInOrRegisterRequest";
import { LogInOrRegisterOtpResponse } from "../response/loginOrRegisterOtpResponse";
import { SessionManager } from "../services/sessionManager";
import { BaseNetworkRepository } from "./baseNetworkRepository";
import NetworkErrorPropagatorDelegate from "./networkErrorPropagatorDelegate";
import { MeResponse } from "../response/MeResponse";

interface LoginInterface {
  email: string;
  enteredOtp: string;
}

interface RegisterInterface {
  email: string;
  cycloidControls?: CycloidControls;
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
    enteredOtp,
  }: LoginInterface & Partial<RegisterInterface>): Promise<User> {
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
          serializedConfiguration: baseConfiguration
            ? JSON.stringify(baseConfiguration)
            : null,
        } as LoginOrRegisterRequest,
      });

    const user = new User({
      email: json.email,
    });

    SessionManager.setSessionToken(json.accessToken);
    SessionManager.user = user;

    return user;
  }

  static async logout() {
    await UserAuthenticationRepository.handle<void>({
      path: "/logout",
      method: "POST",
    });

    UserAuthenticationRepository.clearSessionData();
  }

  static async otpRequest({ email }: OtpRequestsInterface): Promise<void> {
    await UserAuthenticationRepository.handle<void>({
      path: "/otp",
      method: "POST",
      body: { email },
    });
  }

  static async me(): Promise<User | null> {
    try {
      const meResponse = await UserAuthenticationRepository.handle<MeResponse>({
        path: "/me",
        method: "POST",
      });

      SessionManager.setSessionToken(meResponse.newToken);
      return new User({
        email: meResponse.user.email,
      });
    } catch (e) {
      UserAuthenticationRepository.clearSessionData();

      return null;
    }
  }

  static clearSessionData(): void {
    SessionManager.setSessionToken(null);
    SessionManager.user = null;
  }
}
