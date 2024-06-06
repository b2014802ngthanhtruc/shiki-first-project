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
  Request,
  Req,
} from '@nestjs/common';
import { BaseQueryParams } from '@common/dtos';
import { JoiValidationPipe } from '@common/pipes';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { ResponseService } from '@shared/response/response.service';
import { UpdateProductDtoValidator } from '../validators/update-product-dto.validator';
import { CreateProductDtoValidator } from '../validators/create-product-dto.validator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body(new JoiValidationPipe(CreateProductDtoValidator))
    data: CreateProductDto,
  ) {
    return this.productService.createProduct(data);
  }

  @Get()
  async findMany(
    @Query(new JoiValidationPipe(BaseQueryParamsValidator))
    query: BaseQueryParams,
    @Req() req,
  ) {
    const { count, data } = await this.productService.findMany(query);
    return ResponseService.paginateResponse({ count, data, query, req });
  }

  @Get(':id')
  findOne(@Param('id') params: string) {
    return this.productService.findOne(params);
  }

  @Get('/category/:id')
  async findByCategory(
    @Param('id') id: string,
    @Query(new JoiValidationPipe(BaseQueryParamsValidator))
    query: BaseQueryParams,
    @Req() req,
  ) {
    const { count, data } = await this.productService.findByCategory(id, query);
    return ResponseService.paginateResponse({ count, data, query, req });
  }

  @Patch(':id')
  update(
    @Param('id') params: string,
    @Body(new JoiValidationPipe(UpdateProductDtoValidator))
    data: UpdateProductDto,
  ) {
    return this.productService.update(params, data);
  }

  @Delete(':id')
  delete(@Param('id') params: string) {
    return this.productService.remove(params);
  }
}
