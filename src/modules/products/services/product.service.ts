import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BaseQueryParams } from './../../../common/dtos/base-query-params.dto';
import { CategoryRepository } from '@modules/categories/repositories/category.repository';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { ProductRepository } from '../repositories/product.repository';
import { UpdateProductDto } from '../dtos/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: createProductDto.categoryId,
      },
      include: {
        parent: {
          include: {
            parent: true,
          },
        },
      },
    });

    if (!category) throw new NotFoundException('Category not found');
    console.log(category);
    const categoryList = [
      createProductDto.categoryId,
      category.parentId ?? null,
      category.parent?.parentId ?? null,
    ].filter((id) => id);
    return await this.productRepository.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        quantity: createProductDto.quantity,
        description: createProductDto.description,
        categories: categoryList,
        category: {
          connect: {
            id: createProductDto.categoryId,
          },
        },
      },
    });
  }

  async findMany(params: BaseQueryParams) {
    const result = {
      count: await this.productRepository.count({}),
      data: await this.productRepository.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        where: params.search
          ? {
              OR: [{ name: { contains: params.search, mode: 'insensitive' } }],
            }
          : undefined,
        orderBy: params.sort,
      }),
    };
    return result;
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

  async findByCategory(id: string, params: BaseQueryParams) {
    const count = await this.productRepository.count({
      where: {
        categories: {
          has: id,
        },
      },
    });
    const data = await this.productRepository.findMany({
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: params.sort,
      where: {
        categories: {
          has: id,
        },
      },
    });
    return { count, data };
  }

  async update(id: string, { categoryId, ...updateProduct }: UpdateProductDto) {
    console.log(updateProduct);
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!product) throw new BadRequestException('Product not found');
    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: {
          id: categoryId,
        },
        include: {
          parent: true,
        },
      });
      const categoryList = [
        category.id,
        category.parentId ?? null,
        category.parent?.parentId ?? null,
      ].filter((id) => id);
      return await this.productRepository.update({
        where: {
          id,
        },
        data: {
          category: {
            connect: { id: categoryId },
          },
          categories: categoryList,
          ...updateProduct,
        },
      });
    }
    return await this.productRepository.update({
      where: {
        id,
      },
      data: {
        ...updateProduct,
      },
    });
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) throw new BadRequestException('Category not found');
    const delProduct = await this.productRepository.delete({
      id,
    });
    if (delProduct) return 'Success';
  }
}
