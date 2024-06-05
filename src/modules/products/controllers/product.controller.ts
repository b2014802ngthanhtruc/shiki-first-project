import { BaseQueryParamsValidator } from '@common/validators';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { ProductService } from './../services/product.service';
import {
  Body,
  Post,
  Controller,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BaseQueryParams } from '@common/dtos';
import { JoiValidationPipe } from '@common/pipes';
import { UpdateProductDto } from '../dtos/updateProduct.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }

  @Get()
  findMany(
    @Query(new JoiValidationPipe(BaseQueryParamsValidator))
    params: BaseQueryParams,
  ) {
    return this.productService.findMany(params);
  }

  @Get(':id')
  findOne(@Param('id') params: string) {
    return this.productService.findOne(params);
  }

  @Patch(':id')
  update(@Param('id') params: string, @Body() data: UpdateProductDto) {
    return this.productService.update(params, data);
  }

  @Delete(':id')
  delete(@Param('id') params: string) {
    return this.productService.remove(params);
  }
}
