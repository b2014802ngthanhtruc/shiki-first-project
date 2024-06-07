import { ExecutionContext, Injectable } from '@nestjs/common';

import { ADMIN_JWT_ACCESS_STRATEGY } from '../strategies';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { SALER_JWT_ACCESS_STRATEGY } from './../strategies/saler-jwt-access.strategy';

@Injectable()
export class OrAuthGuard extends AuthGuard([
  ADMIN_JWT_ACCESS_STRATEGY,
  SALER_JWT_ACCESS_STRATEGY,
]) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
