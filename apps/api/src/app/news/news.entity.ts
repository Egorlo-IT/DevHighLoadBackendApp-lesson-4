import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CategoriesEntity } from '../categories/categories.entity';
import { UsersEntity } from '../users/users.entity';
import { CommentsEntity } from './comments/comments.entity';

@Entity('news')
export class NewsEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 'News id', description: 'News id' })
  id: number;

  @Column('text')
  @ApiProperty({ example: 'News title', description: 'News title' })
  title: string;

  @Column('text')
  @ApiProperty({ example: 'News description', description: 'News description' })
  description: string;

  @Column('text', { nullable: true })
  @ApiProperty({ example: 'News cover', description: 'News cover' })
  cover: string;

  @ManyToOne(() => CategoriesEntity, (category) => category.news)
  @ApiProperty({
    example: 'Entity CategoriesEntity',
    description: 'Entity CategoriesEntity',
  })
  category: CategoriesEntity;

  @ManyToOne(() => UsersEntity, (user) => user.news)
  user: UsersEntity;

  @OneToMany(() => CommentsEntity, (comments) => comments.news)
  @ApiProperty({
    example: 'Array entities CommentsEntity',
    description: 'Array entities CommentsEntity',
  })
  comments: CommentsEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date create news',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date update news',
  })
  updatedAt: Date;
}
