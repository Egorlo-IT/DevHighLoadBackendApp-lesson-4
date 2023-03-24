import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MailService } from './mail.service';

@Controller('mail')
@ApiBearerAuth()
@ApiTags('Email')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  @ApiOperation({ summary: 'Send email' })
  @ApiResponse({
    status: 200,
    description: 'Mail sent successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async sendTestEmail() {
    return await this.mailService.sendTest();
  }
}
