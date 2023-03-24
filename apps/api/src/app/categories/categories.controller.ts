import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesEntity } from './categories.entity';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('categories')
@ApiBearerAuth()
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Category creation' })
  @ApiResponse({
    status: 200,
    description: 'Category successfully created',
    type: CategoriesEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async create(@Body('name') name): Promise<CategoriesEntity> {
    return this.categoriesService.create(name);
  }
}
