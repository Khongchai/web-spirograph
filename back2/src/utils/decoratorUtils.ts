import {
  createParamDecorator,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import ReflectionUtils from './reflectionUtils';

export default class DecoratorUtils {
  private static _baseLoggingMethod(
    logger: Function,
    description: string,
    { stringifyLog } = {
      stringifyLog: true,
    },
  ): MethodDecorator {
    if (!logger) throw new Error('Logger is not defined');

    return (_, __, descriptor) => {
      const originalMethod: any = descriptor.value;
      const isMethodAsync = ReflectionUtils.isFunctionAsync(originalMethod);

      //@ts-ignore
      descriptor.value = isMethodAsync
        ? async function (...args) {
            const result = await originalMethod.apply(this, args);
            logger(
              `${description}${stringifyLog ? JSON.stringify(result) : result}`,
            );
            return result;
          }
        : function (...args) {
            const result = originalMethod.apply(this, args);
            logger(
              `${description}${stringifyLog ? JSON.stringify(result) : result}`,
            );
            return result;
          };
    };
  }

  /**
   * Logs the return value of the current method
   */
  static returnLog = {
    debug: function (description = '') {
      return DecoratorUtils._baseLoggingMethod(
        (str: string) => Logger.debug(str),
        description,
      );
    },
  };

  static user = {
    authUser: createParamDecorator((_, req) => {
      const userEmail = req.switchToHttp().getRequest().user.issuer;
      return userEmail;
    }),
  };
}
