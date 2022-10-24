import {
  CACHE_MANAGER,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  override handleRequest(
    err: any,
    user: any,
    info: { message: string; name: string },
  ) {
    if (err || !user) {
      Logger.debug(info);

      throw err || new UnauthorizedException();
    }

    return user;
  }
}
