import {
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
@ApiBearerAuth()
@ApiTags('Security and other')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get()
  @Render('index')
  @ApiOperation({ summary: 'Get home page' })
  @ApiResponse({
    status: 200,
    description: 'Home page successfully received',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async getHello(@Request() req): Promise<{ message; cookies }> {
    const cookies = req?.cookies?.user ? await req.cookies : null;
    const message = this.appService.getData();
    return { message, cookies };
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiOperation({ summary: 'Get auth/login' })
  @ApiResponse({
    status: 200,
    description: 'Authorization successful',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.login(req.user);

    console.log('access_token:', access_token);

    res.cookie('token', access_token, { httpOnly: true, secure: false });
    return access_token;
  }

  @Post('auth/logout')
  @ApiOperation({ summary: 'Get auth/logout' })
  @ApiResponse({
    status: 200,
    description: 'Logout completed successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    res.clearCookie('user');
    return true;
  }

  @Get('auth/token')
  @ApiOperation({ summary: 'Get auth/token' })
  @ApiResponse({
    status: 200,
    description: 'Token successfully received',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async getCookies(@Request() req): Promise<{ token }> {
    const token = req.cookies?.token?.access_token
      ? await req.cookies.token.access_token
      : null;
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/user')
  @ApiOperation({ summary: 'Get auth/user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully received',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  getProfile(@Request() req, @Res({ passthrough: true }) res: Response) {
    res.cookie(
      'user',
      {
        id: req.user.id,
        avatar: req.user.avatar,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        exp: req.user.exp,
      },
      { httpOnly: true, secure: false }
    );
    return req.user;
  }
}
