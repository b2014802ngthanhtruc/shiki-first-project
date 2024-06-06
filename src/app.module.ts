import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AdminJwtAccessAuthGuard } from '@modules/auth/guards/admin-jwt-access-auth.guard';
import { AllExceptionsFilter } from '@common/filters';
import { AnyOfGuard } from '@modules/auth/guards/any-of-guard.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { CategoriesModule } from './modules/categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigSchema } from '@config/config.schema';
import { Environment } from '@common/enums';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailModule } from '@shared/mail/mail.module';
import { MailService } from '@shared/mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@shared/prisma/prisma.module';
import { ProductModule } from '@modules/products/product.module';
import { ResponseModule } from '@shared/response/response.module';
import { ResponseTransformInterceptor } from '@common/interceptors';
import { SalerJwtAccessAuthGuard } from '@modules/auth/guards/saler-jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || Environment.DEVELOPMENT}`,
      isGlobal: true,
      cache: true,
      validationSchema: ConfigSchema,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'thanhtruc280402@gmail.com',
          pass: 'tasz iome bymc vxoy',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
      template: {
        dir: 'src/shared/mail/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // Shared modules
    PrismaModule,
    ResponseModule,

    // Feature modules
    AuthModule,

    UsersModule,
    MailModule,
    CategoriesModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MailService,
    {
      provide: APP_GUARD,
      useClass: AnyOfGuard,
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
  ],
})
export class AppModule {}
