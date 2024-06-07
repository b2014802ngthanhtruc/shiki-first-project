import { OnQueueError, OnQueueFailed } from '@nestjs/bull';

import { AUTH_QUEUE_PROCESS_NAME } from '../constants';
import { DEFAULT_OPTS } from './../../../shared/queue/services/queue.service';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { MailService } from '@shared/mail/mail.service';
import { QUEUE_NAME } from '@shared/queue/constants/queue.constant';
import { QueueService } from '@shared/queue/services/queue.service';

@Injectable()
export class AuthQueueService {
  constructor(
    private readonly _queueService: QueueService,
    private readonly _mailService: MailService,
  ) {}

  async addSendEmailJob(email: string, code: string) {
    const job = await this._queueService.addJob({
      queueName: QUEUE_NAME.AUTH_QUEUE,
      processName: AUTH_QUEUE_PROCESS_NAME.SEND_FORGOT_PASSWORD_EMAIL,
      payload: { email, code },
      otps: DEFAULT_OPTS,
    });
    return job;
  }

  async handleSendEmail({ email, code }) {
    try {
      const result = await this._mailService.sendResetEmail(email, code);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, error: any) {
    console.error(`Job ${job.id} failed with error:`, error);
    // Xử lý lỗi tại đây
  }

  @OnQueueError()
  async onQueueError(error: any) {
    console.error('Queue error:', error);
    // Xử lý lỗi tại đây
  }
}
