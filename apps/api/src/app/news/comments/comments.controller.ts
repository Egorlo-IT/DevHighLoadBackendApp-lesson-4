import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentCreateDto } from './dtos/comment-create.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NewsIdDto } from '../dtos/news-id.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentsEntity } from './comments.entity';

@Controller('news-comments')
@ApiBearerAuth()
@ApiTags('Сomments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create/:idNews')
  @ApiOperation({ summary: 'News creation' })
  @ApiResponse({
    status: 200,
    description: 'Comment successfully created',
    type: CommentsEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  create(
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() comment: CommentCreateDto
  ) {
    return this.commentsService.create(
      idNews,
      comment.message,
      +comment.userId
    );
  }

  @Post('edit/:idComment/:idNews')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Comment edit' })
  @ApiResponse({
    status: 200,
    description: 'Comment successfully edit',
    type: CommentsEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async edit(
    @Param('idComment', ParseIntPipe) idComment: number,
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() comment: CommentCreateDto
  ) {
    return this.commentsService.edit(
      +idComment,
      +idNews,
      comment.message,
      +comment.userId
    );
  }

  @Delete(':idComment/:idNews')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Comment delete' })
  @ApiResponse({
    status: 200,
    description: 'Comment successfully deleted',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async remove(
    @Param('idComment', ParseIntPipe) idComment: number,
    @Param('idNews', ParseIntPipe) idNews: number
  ) {
    return this.commentsService.remove(idComment, idNews);
  }

  @Get('all/news/:id')
  @ApiOperation({ summary: 'Get comments' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Comments successfully received',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async getAll(@Param() params: NewsIdDto) {
    const comments = await this.commentsService.findAll(+params.id);
    return comments;
  }
}
