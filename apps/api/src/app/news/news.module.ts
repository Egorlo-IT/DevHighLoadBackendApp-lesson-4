import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    TypeOrmModule.forFeature([NewsEntity]),
    CommentsModule,
    MailModule,
    UsersModule,
    CategoriesModule,
  ],
  exports: [NewsService],
})
export class NewsModule {}
