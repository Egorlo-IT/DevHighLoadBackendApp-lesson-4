import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UsersEntity } from '../../users/users.entity';
import { NewsEntity } from '../news.entity';

@Entity('comments')
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 'Comment id', description: 'Comment id' })
  id: number;

  @Column('text')
  @ApiProperty({ example: 'Comment message', description: 'Comment message' })
  message: string;

  @ManyToOne(() => UsersEntity, (user) => user.comments, {
    cascade: true,
  })
  user: UsersEntity;

  @ManyToOne(() => NewsEntity, (news) => news.comments, {
    cascade: true,
  })
  news: NewsEntity;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date create comment',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date update comment',
  })
  updatedAt: Date;
}
