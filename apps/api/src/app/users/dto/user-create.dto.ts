import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { Role } from '../../auth/role/role.enum';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'User first name', description: 'User first name' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'User last name',
    description: 'User last name',
  })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'User email',
    description: 'User email',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'User password',
    description: 'User password',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'User role',
    description: 'User role',
  })
  role: Role;
}
