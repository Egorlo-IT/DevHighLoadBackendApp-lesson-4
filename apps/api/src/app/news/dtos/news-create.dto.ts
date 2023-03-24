import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
export class NewsCreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'News title', description: 'News title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'News description', description: 'News description' })
  description: string;

  @ValidateIf((o) => o.cover)
  @IsString()
  @ApiProperty({ example: 'News cover', description: 'News cover' })
  cover: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Author id', description: 'Author id' })
  authorId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Category id', description: 'Category id' })
  categoryId: number;
}
