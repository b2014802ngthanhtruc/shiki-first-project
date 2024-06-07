import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../services';
import { CONFIG_VAR } from '@config/index';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtAccessPayload } from '../dtos';
import { PassportStrategy } from '@nestjs/passport';

export const SALER_JWT_ACCESS_STRATEGY = 'saler_jwt_access';

@Injectable()
export class SalerJwtAccessStrategy extends PassportStrategy(
  Strategy,
  SALER_JWT_ACCESS_STRATEGY,
) {
  constructor(
    configService: ConfigService,
    private readonly _authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(CONFIG_VAR.SALER_JWT_SECRET),
    });
  }

  async validate(payload: JwtAccessPayload) {
    const saler = await this._authService.validateSaler(payload);
    return saler;
  }
}
