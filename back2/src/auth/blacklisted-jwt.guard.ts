import {
    CACHE_MANAGER, CanActivate,
    ExecutionContext, Inject, Injectable, UnauthorizedException
} from '@nestjs/common';
import NestJSCache from 'cache-manager';
import { AuthService } from './auth.service';

@Injectable()
export class BlackListedJwtGuard implements CanActivate {
  @Inject(CACHE_MANAGER) private cacheManager: NestJSCache.Cache;

  async canActivate(
    context: ExecutionContext,
  ) {
    const jwt = context
      .switchToHttp()
      .getRequest()
      .headers.authorization.replace('Bearer ', '');

    const storedJwt = await this.cacheManager.get(
      jwt + AuthService.blackListedKey
    );

    if (storedJwt) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
