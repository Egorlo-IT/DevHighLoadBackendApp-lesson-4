import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoriesService } from '../categories/categories.service';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { HelperFileLoaderNews } from '../utils/helperFileLoaderNews';
import { imageFileFilter } from '../utils/imageFileFilter';
import { CommentsService } from './comments/comments.service';
import { NewsCreateDto } from './dtos/news-create.dto';
import { NewsIdDto } from './dtos/news-id.dto';
import { NewsEntity } from './news.entity';
import { NewsService } from './news.service';

const NEWS_PATH = '/news-static/';
const newsHelperFileLoader = new HelperFileLoaderNews();
newsHelperFileLoader.path = NEWS_PATH;

@Controller('news')
@ApiBearerAuth()
@ApiTags('News')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private usersService: UsersService,
    private readonly commentsService: CommentsService,
    private categoriesService: CategoriesService,
    private mailService: MailService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all news' })
  @ApiResponse({
    status: 200,
    description: 'News successfully received',
    type: NewsEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async getAll(
    @Request() req
  ): Promise<{ news: NewsEntity[]; cookies: unknown }> {
    const news = await this.newsService.findAll();
    const cookies = req?.cookies?.user ? await req.cookies : null;
    return { ...news, cookies };
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: newsHelperFileLoader.destinationPath,
        filename: newsHelperFileLoader.customFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  @ApiOperation({ summary: 'News creation' })
  @ApiResponse({
    status: 200,
    description: 'News successfully created',
    type: NewsEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async create(
    @Body() news: NewsCreateDto,
    @UploadedFile() cover: Express.Multer.File
  ) {
    try {
      const _user = await this.usersService.findById(+news.authorId);
      if (!_user) {
        throw new HttpException(
          'Не существует такого автора',
          HttpStatus.BAD_REQUEST
        );
      }
      const _category = await this.categoriesService.findById(news.categoryId);
      if (!_category) {
        throw new HttpException(
          'Не существует такой категории',
          HttpStatus.BAD_REQUEST
        );
      }

      const _newsEntity = new NewsEntity();
      if (cover?.filename) {
        _newsEntity.cover = NEWS_PATH + cover.filename;
      }
      _newsEntity.title = news.title;
      _newsEntity.description = news.description;
      _newsEntity.user = _user;
      _newsEntity.category = _category;

      const _news = await this.newsService.create(_newsEntity);
      // await this.mailService.sendNewNewsForAdmins(
      //   ['egorlo059@gmail.com'],
      //   _news
      // );
      return _news;
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id/detail')
  @ApiOperation({ summary: 'News details' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'News details successfully received',
    type: NewsEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async getByIdDetail(@Param() params: NewsIdDto, @Request() req) {
    const cookies = req.cookies?.user ? await req.cookies : null;
    const news = await this.newsService.findById(+params.id);
    const comments = await this.commentsService.findAll(+params.id);
    return { news, comments, cookies };
  }
}
