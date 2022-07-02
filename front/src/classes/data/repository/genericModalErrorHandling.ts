/**
 * Shows an alert dialog when we intercept a network error
 *
 * We also make an assumption that all classes methods are async
 */
export default function GenericRepositoryModalErrorHandling(
  tag: string,
  methodType: "static" | "instance"
) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
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
        } catch (e) {
          console.error("Something went wrong in the " + tag + " class");
          console.error(e);

          //TODO implement a better-looking error dialog
          alert("Sorry, something went wrong");
        }
      };
    });

    return constructor;
  };
}
