import { Environment } from '@common/enums';
import { AllExceptionsFilter } from '@common/filters';
import { ResponseTransformInterceptor } from '@common/interceptors';
import { ConfigSchema } from '@config/config.schema';
import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '@shared/prisma/prisma.module';
import { ResponseModule } from '@shared/response/response.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { MailService } from '@shared/mail/mail.service';
import { BullModule } from '@nestjs/bull';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailModule } from '@shared/mail/mail.module';

import { CategoriesModule } from './modules/categories/categories.module';
import { ProductModule } from '@modules/products/product.module';

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
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
  ],
})
export class AppModule {}
