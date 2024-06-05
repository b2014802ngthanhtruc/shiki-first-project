import { AdminAuthController, AuthController } from './controllers';
import {
  AdminJwtAccessStrategy,
  JwtAccessStrategy,
  LocalStrategy,
} from './strategies';

import { AuthService } from './services';
import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { MailService } from '@shared/mail/mail.service';
import { EmailConsumer } from '@shared/mail/email.consumer';
import { MailModule } from '@shared/mail/mail.module';

@Module({
  imports: [UsersModule, PassportModule, MailModule],
  controllers: [AdminAuthController, AuthController],
  providers: [
    AuthService,
    MailService,
    JwtAccessStrategy,
    LocalStrategy,
    AdminJwtAccessStrategy,
    // Repositories
  ],
  exports: [AuthService],
})
export class AuthModule {}
