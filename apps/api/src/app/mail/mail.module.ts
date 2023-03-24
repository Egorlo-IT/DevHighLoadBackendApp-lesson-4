import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfigService } from './mail.config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailConfigService,
      inject: [MailConfigService],
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
