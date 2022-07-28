import {
  ClientError,
  GenericNetworkError,
  ServerError,
  UndefinedError,
} from "../../customEvents";

/**
 * Shows an alert dialog when we intercept a network error
 *
 * We also make an assumption that all classes methods are async
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
        try {
          if (methodType === "static") {
            await originalMethod(...args);
          } else {
            await originalMethod.apply(this, args);
          }
        } catch (e: any) {
          console.error("Something went wrong in the " + tag + " class.");
          console.warn("Error details below");

          if (e instanceof UndefinedError) {
            throw mapNetworkError(e.details);
          } else {
            throw e;
          }
        }
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
