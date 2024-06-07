import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import { AuthConsumer } from './consumers/auth.consumer';
import { AuthModule } from '@modules/auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { CONFIG_VAR } from '@config/config.constant';
import { QUEUE_NAME } from './constants/queue.constant';
import { QueueService } from './services/queue.service';
import { UsersModule } from '@modules/users/users.module';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          redis: {
            host: config.get(CONFIG_VAR.REDIS_HOST),
            port: parseInt(config.get(CONFIG_VAR.REDIS_PORT)),
          },
        };
      },
    }),
    BullModule.registerQueue({ name: QUEUE_NAME.AUTH_QUEUE }),
    AuthModule,
    UsersModule,
  ],
  providers: [QueueService, AuthConsumer],
  exports: [QueueService],
})
export class QueueModule {}
