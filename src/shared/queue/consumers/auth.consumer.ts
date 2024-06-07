import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';

import { AUTH_QUEUE_PROCESS_NAME } from '@modules/auth/constants';
import { AuthQueueService } from '@modules/auth/services/auth-queue.service';
import { Job } from 'bull';
import { QUEUE_NAME } from '../constants/queue.constant';

@Processor(QUEUE_NAME.AUTH_QUEUE)
export class AuthConsumer {
  constructor(private _authQueueService: AuthQueueService) {}

  @OnQueueCompleted()
  onComplete() {
    console.log('Success');
  }

  @Process(AUTH_QUEUE_PROCESS_NAME.SEND_FORGOT_PASSWORD_EMAIL)
  async sendEmailForgotPassword(job: Job) {
    const result = await this._authQueueService.handleSendEmail(job.data);
    return result;
  }
}
