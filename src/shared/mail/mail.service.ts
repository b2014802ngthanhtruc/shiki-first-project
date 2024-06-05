import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async addEmailJob(email: string, code: string) {
    console.log('add job');
    this.emailQueue.on('error', (error) => console.log('error', error));
    const isConnect = await this.emailQueue.client.status;
    console.log(isConnect);
    console.log(await this.emailQueue.getWaitingCount());
    try {
      return await this.emailQueue.add(
        'send-email',
        { email, code },
        // {
        //   attempts: 5,
        //   backoff: 1000,
        // },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async sendResetEmail(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Code',
        template: './send-email.template.hbs',
        context: {
          code,
        },
      });
      return {
        message: 'Email was sent successfully',
      };
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
