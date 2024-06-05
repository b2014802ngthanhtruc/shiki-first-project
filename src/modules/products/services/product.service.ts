import { BaseQueryParams } from './../../../common/dtos/base-query-params.dto';
import { ProductRepository } from '../repositories/product.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { UpdateProductDto } from '../dtos/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(createProductDto: CreateProductDto) {
    return await this.productRepository.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        quantity: createProductDto.quantity,
        description: createProductDto.description,
        category: {
          connect: {
            id: createProductDto.categoryId,
          },
        },
      },
    });
  }

  async findMany(params: BaseQueryParams) {
    return this.productRepository.findMany({
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      where: params.search
        ? {
            OR: [{ name: { contains: params.search, mode: 'insensitive' } }],
          }
        : undefined,
      orderBy: params.sort,
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!product) throw new BadRequestException('Product not found');
    return product;
  }

  async update(id: string, { categoryId, ...updateProduct }: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!product) throw new BadRequestException('Product not found');
    return await this.productRepository.update({
      where: {
        id,
      },
      data: categoryId
        ? {
            ...updateProduct,
            category: {
              connect: {
                id: categoryId,
              },
            },
          }
        : updateProduct,
    });
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) throw new BadRequestException('Category not found');
    return this.productRepository.delete({
      id,
    });
  }
}
