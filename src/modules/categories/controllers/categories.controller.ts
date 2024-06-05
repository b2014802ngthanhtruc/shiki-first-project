import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/createCategories.dto';
import { UpdateCategoryDto } from '../dtos/updateCategories.dto';
import { BaseQueryParams } from '@common/dtos';
import { BaseQueryParamsValidator } from '@common/validators';
import { JoiValidationPipe } from '@common/pipes';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() data: CreateCategoryDto) {
    return this.categoryService.create(data);
  }

  @Get()
  findMany(
    @Query(new JoiValidationPipe(BaseQueryParamsValidator))
    params: BaseQueryParams,
  ) {
    return this.categoryService.findMany(params);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategories: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategories);
  }
}
