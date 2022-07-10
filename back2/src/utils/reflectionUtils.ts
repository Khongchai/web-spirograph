export default class ReflectionUtils {
  private static _constants = {
    asyncFunctionConstructor: Object.getPrototypeOf(async function () {})
      .constructor,
  };

  static isFunctionAsync = (fn: Function) =>
    fn instanceof ReflectionUtils._constants.asyncFunctionConstructor;
}
