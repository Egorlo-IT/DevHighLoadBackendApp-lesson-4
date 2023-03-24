import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { NewsEntity } from '../news/news.entity';
import { CommentsEntity } from '../news/comments/comments.entity';
import { Role } from '../auth/role/role.enum';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 'User id', description: 'User id' })
  id: number;

  @Column('text')
  @ApiProperty({ example: 'User first name', description: 'User first name' })
  firstName: string;

  @Column('text')
  @ApiProperty({
    example: 'User last name',
    description: 'User last name',
  })
  lastName: string;

  @Column('text')
  @ApiProperty({
    example: 'User email',
    description: 'User email',
  })
  email: string;

  @Column('text')
  @ApiProperty({
    example: 'User password',
    description: 'User password',
  })
  password: string;

  @Column('text')
  @IsEnum(Role)
  @ApiProperty({
    example: 'User role',
    description: 'User role',
  })
  roles: Role;

  @OneToMany(() => NewsEntity, (news) => news.user)
  news: NewsEntity[];

  @OneToMany(() => CommentsEntity, (comments) => comments.user)
  comments: CommentsEntity[];

  @Column('text', { nullable: true })
  @ApiProperty({
    example: 'User avatar',
    description: 'User avatar',
  })
  avatar: string;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date create user',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date update user',
  })
  updatedAt: Date;
}
