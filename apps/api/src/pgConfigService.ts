import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { CategoriesEntity } from './app/categories/categories.entity';
import { CommentsEntity } from './app/news/comments/comments.entity';
import { NewsEntity } from './app/news/news.entity';
import { UsersEntity } from './app/users/users.entity';

@Injectable()
export class PgConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '11111111',
      database: 'news_blog',
      entities: [UsersEntity, NewsEntity, CommentsEntity, CategoriesEntity],
      synchronize: true,

      // type: this.configService.get<never>('DATABASE_TYPE'),
      // host: this.configService.get<string>('DATABASE_HOST'),
      // port: this.configService.get<number>('DATABASE_PORT'),
      // username: this.configService.get<string>('DATABASE_USERNAME'),
      // password: this.configService.get<string>('DATABASE_PASSWORD'),
      // database: this.configService.get<string>('DATABASE_NAME'),
      // entities: [UsersEntity, NewsEntity, CommentsEntity, CategoriesEntity],
      // synchronize: true,
    };
  }
}
