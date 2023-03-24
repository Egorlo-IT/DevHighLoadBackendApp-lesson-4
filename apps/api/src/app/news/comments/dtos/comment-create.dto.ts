import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CommentCreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Comment message', description: 'Comment message' })
  message: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'User id', description: 'User id' })
  userId: number;
}
