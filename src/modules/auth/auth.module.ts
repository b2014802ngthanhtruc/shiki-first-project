import {
  AdminAuthController,
  AuthController,
  SalerAuthController,
} from './controllers';
import {
  AdminJwtAccessStrategy,
  JwtAccessStrategy,
  LocalStrategy,
  SalerJwtAccessStrategy,
} from './strategies';

import { AuthService } from './services';
import { MailModule } from '@shared/mail/mail.module';
import { MailService } from '@shared/mail/mail.service';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [UsersModule, PassportModule, MailModule],
  controllers: [AdminAuthController, AuthController, SalerAuthController],
  providers: [
    AuthService,
    MailService,
    JwtAccessStrategy,
    LocalStrategy,
    AdminJwtAccessStrategy,
    SalerJwtAccessStrategy,
    // Repositories
  ],
  exports: [AuthService],
})
export class AuthModule {}
