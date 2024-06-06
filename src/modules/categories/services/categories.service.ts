import { BadRequestException, Injectable } from '@nestjs/common';

import { BaseQueryParams } from '@common/dtos';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../dtos/createCategories.dto';
import { UpdateCategoryDto } from '../dtos/updateCategories.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository, // private readonly productRepository: ProductRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const productName = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (productName) throw new BadRequestException('Category is already exist');
    const category = await this.categoryRepository.findOne({
      where: {
        id: createCategoryDto.parentId,
      },
    });
    return this.categoryRepository.create({
      data: {
        name: createCategoryDto.name,
        parent: createCategoryDto.parentId && {
          connect: {
            id: createCategoryDto.parentId,
          },
        },
        level: createCategoryDto.parentId ? category.level + 1 : 0,
      },
    });
  }

  async findMany(params: BaseQueryParams) {
    const result = {
      count: await this.categoryRepository.count({}),
      data: await this.categoryRepository.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        where: {
          level: 0,
        },
        include: {
          childCategories: {
            include: {
              childCategories: true,
            },
          },
          parent: true,
        },
      }),
    };
    return result;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) throw new BadRequestException('Category not found');
    if (category.childCategories.length > 0)
      throw new BadRequestException('Category cannot be update');
    return this.categoryRepository.update({
      where: {
        id: id,
      },
      data: updateCategoryDto,
    });
  }

  findOne(id: string) {
    return this.categoryRepository.findOne({
      where: {
        id,
      },
      include: {
        childCategories: {
          include: {
            childCategories: true,
          },
        },
        parent: true,
      },
    });
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      include: {
        childCategories: true,
      },
    });

    if (!category) throw new BadRequestException('Category not found');
    if (category.childCategories.length > 0)
      throw new BadRequestException('Category can be delete');
    return this.categoryRepository.delete({
      id,
    });
  }

  // async findProduct(id: string) {
  //   const category = await this.categoryRepository.findOne({
  //     where: {
  //       id,
  //     },
  //   });
  //   if (!category) throw new NotFoundException('Category not found');
  //   const products = await this.productRepository.findMany({
  //     where: {
  //       OR: [
  //         { categoryId: id },
  //         { category: { parentId: id } },
  //         { category: { parent: { parentId: id } } },
  //       ],
  //     },
  //   });
  /* SELECT * FROM Product
      WHERE categoryId in (
        SELECT * FROM Category
          WHERE id in (
            SELECT * FROM Category
              WHERE parentId in (
                SELECT * FROM Category
                  WHERE id == ($id)
              )
          )
      OR parentId in (
        SELECT * FROM Category
          WHERE id in (
            SELECT * FROM Category
              WHERE parentId in (
                SELECT * FROM Category
                  WHERE id == ($id)
              )
          )
      )
      */
  // if (category.level === 2)
  //   return this.productRepository.findMany({
  //     where: {
  //       categoryId: id,
  //     },
  //   });

  // const getChildCategories = async (categoryId) => {
  //   const childCategories = await this.categoryRepository.findMany({
  //     where: { parentId: categoryId },
  //     include: { childCategories: true },
  //   });
  //   return childCategories;
  // };

  // const getAllChildCategories = async (categoryId) => {
  //   const directChildren = await getChildCategories(categoryId);
  //   const allChildren = await Promise.all(
  //     directChildren.map(async (child) => {
  //       const descendants = await getAllChildCategories(child.id);
  //       return [child, ...descendants];
  //     }),
  //   );
  //   return allChildren.flat();
  // };

  // const allChildCategories = await getAllChildCategories(id);

  // const level2Categories = allChildCategories.filter(
  //   (category) => category.level === 2,
  // );

  // const products = await this.productRepository.findMany({
  //   where: {
  //     categoryId: {
  //       in: level2Categories.map((category) => category.id),
  //     },
  //   },
  // });

  // return products;
  //}
}
