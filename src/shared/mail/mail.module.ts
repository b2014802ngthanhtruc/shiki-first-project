import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { EmailConsumer } from './email.consumer';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [MailService, EmailConsumer],
  exports: [MailService, BullModule, EmailConsumer],
})
export class MailModule {}
