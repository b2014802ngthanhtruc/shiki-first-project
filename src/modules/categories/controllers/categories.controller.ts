import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CategoryService } from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/createCategories.dto';
import { UpdateCategoryDto } from '../dtos/updateCategories.dto';
import { BaseQueryParams } from '@common/dtos';
import { BaseQueryParamsValidator } from '@common/validators';
import { JoiValidationPipe } from '@common/pipes';
import { ResponseService } from '@shared/response/response.service';
import { query } from 'express';
import { UpdateCategoryDtoValidator } from '../validators/update-category-dto.validator';
import { CreateCategoryDtoValidator } from '../validators/create-category-dto.validator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @Body(new JoiValidationPipe(CreateCategoryDtoValidator))
    data: CreateCategoryDto,
  ) {
    return this.categoryService.create(data);
  }

  @Get()
  async findMany(
    @Query(new JoiValidationPipe(BaseQueryParamsValidator))
    query: BaseQueryParams,
    @Req() req,
  ) {
    const { count, data } = await this.categoryService.findMany(query);
    return ResponseService.paginateResponse({ count, data, query, req });
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateCategoryDtoValidator))
    updateCategories: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategories);
  }
}
