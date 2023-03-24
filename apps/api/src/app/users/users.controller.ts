import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { UserCreateDto } from './dto/user-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoaderUser } from '../utils/helperFileLoaderUser';
import { imageFileFilter } from '../utils/imageFileFilter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

const USER_PATH = '/user-static/';
const usersHelperFileLoader = new HelperFileLoaderUser();

@Controller('users')
@ApiBearerAuth()
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    usersHelperFileLoader.path = USER_PATH;
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: usersHelperFileLoader.destinationPath,
        filename: usersHelperFileLoader.customFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  @ApiOperation({ summary: 'User creation' })
  @ApiResponse({
    status: 200,
    description: 'User successfully created',
    type: UsersEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async create(
    @Body() user: UserCreateDto,
    @UploadedFile() avatar: Express.Multer.File
  ): Promise<UsersEntity> {
    try {
      let avatarPath = null;
      if (avatar?.filename) {
        avatarPath = USER_PATH + avatar.filename;
      }
      return this.usersService.create(user, avatarPath ? avatarPath : null);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('login')
  @Render('login')
  @ApiOperation({ summary: 'Get user login' })
  @ApiResponse({
    status: 200,
    description: 'User successfully login',
    type: UsersEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized Error',
    type: Error,
  })
  async getLogin(@Request() req) {
    const cookies = req.cookies?.user ? await req.cookies : null;
    return { cookies };
  }

  @Get('register')
  @Render('register')
  @ApiOperation({ summary: 'Get user register' })
  @ApiResponse({
    status: 200,
    description: 'User successfully registered',
    type: UsersEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  getRegister() {
    return;
  }
}
