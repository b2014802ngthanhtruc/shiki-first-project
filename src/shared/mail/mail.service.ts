import { BadRequestException, Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetEmail(email: string, code: string) {
    console.log('send');
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
