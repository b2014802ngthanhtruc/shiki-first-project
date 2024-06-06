import {
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Observable, lastValueFrom } from 'rxjs';

import { AdminJwtAccessAuthGuard } from './admin-jwt-access-auth.guard';
import { SalerJwtAccessAuthGuard } from './saler-jwt-auth.guard';

export class AnyOfGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AdminJwtAccessAuthGuard))
    private readonly adminAuthGuard: AdminJwtAccessAuthGuard,
    @Inject(forwardRef(() => SalerJwtAccessAuthGuard))
    private readonly salerAuthGuard: SalerJwtAccessAuthGuard,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const adminCanActivate = await this.toPromise(
      this.adminAuthGuard.canActivate(context),
    );
    const salerCanActivate = await this.toPromise(
      this.salerAuthGuard.canActivate(context),
    );

    return adminCanActivate || salerCanActivate;
  }

  private toPromise(
    maybePromiseOrObservable: boolean | Promise<boolean> | Observable<boolean>,
  ): Promise<boolean> {
    if (maybePromiseOrObservable instanceof Observable) {
      return lastValueFrom(maybePromiseOrObservable);
    }
    return Promise.resolve(maybePromiseOrObservable);
  }
}
