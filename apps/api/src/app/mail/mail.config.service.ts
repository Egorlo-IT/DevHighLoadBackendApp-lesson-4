import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class MailConfigService implements MailerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport:
        'smtps://' +
        this.configService.get<string>('MAILER_EMAIL') +
        ':' +
        this.configService.get<string>('MAILER_PASSWORD') +
        '@' +
        this.configService.get<string>('MAILER_SERVER'),
      defaults: {
        from:
          '"NestJS робот" <' +
          this.configService.get<string>('MAILER_EMAIL') +
          '>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
