import { resourceUsage } from "process";
import { resourceLimits } from "worker_threads";
import {
  ClientError,
  GenericNetworkError,
  ServerError,
  UndefinedError,
} from "../../customEvents";

/**
 * Intercepts network errors and propagates them to the caller as custom error types.
 */
export default function NetworkErrorPropagatorDelegate(
  tag: string,
  methodType: "static" | "instance"
): ClassDecorator {
  return function (constructor) {
    const prototype =
      methodType === "static" ? constructor : constructor.prototype;

    Object.getOwnPropertyNames(prototype).forEach((name, i) => {
      const isBaseImmutableProperty = i <= 2; // ['length', 'name', 'prototype']
      if (isBaseImmutableProperty) return;

      const originalMethod = prototype[name];
      prototype[name] = async function (...args: any[]) {
        let result: any;
        try {
          if (methodType === "static") {
            result = await originalMethod(...args);
          } else {
            result = await originalMethod.apply(this, args);
          }
        } catch (e: any) {
          console.error("Something went wrong in the " + tag + " class.");
          console.warn("Error details below");
          console.log(e);

          if (e instanceof UndefinedError) {
            throw mapNetworkError(e.details);
          } else {
            throw e;
          }
        }

        return result;
      };
    });

    return constructor;
  };
}

function mapNetworkError(response: Response) {
  const statusInitial = response.status.toString()[0];

  console.info(response);

  switch (statusInitial) {
    case "4":
      return new ClientError(response);
    case "5":
      return new ServerError(response);
    default:
      return new GenericNetworkError(response);
  }
}
