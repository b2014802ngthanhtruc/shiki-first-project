import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';
import { BadRequestException } from '@nestjs/common/exceptions';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email')
export class EmailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process('send-email')
  async handleSendEmail(job: Job) {
    const { email, code } = job.data;
    console.log('Sending email to: ', job);
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

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Proccessing job`, job.data);
  }
}
