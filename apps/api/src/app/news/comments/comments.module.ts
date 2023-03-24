import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { SocketCommentsGateway } from './socket-comments.gateway';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { NewsModule } from '../news.module';
import { UsersModule } from '../../users/users.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  providers: [CommentsService, SocketCommentsGateway],
  controllers: [CommentsController],
  imports: [
    forwardRef(() => NewsModule),
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([CommentsEntity]),
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
