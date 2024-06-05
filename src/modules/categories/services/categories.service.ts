import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseQueryParams } from '@common/dtos';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../dtos/createCategories.dto';
import { UpdateCategoryDto } from '../dtos/updateCategories.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
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

  findMany(params: BaseQueryParams) {
    return this.categoryRepository.findMany({
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      where: {
        level: 1,
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

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) throw new BadRequestException('Category not found');
    return this.categoryRepository.update({
      where: {
        id: id,
      },
      data: updateCategoryDto.parentId
        ? {
            parent: category.parentId
              ? {
                  connect: {
                    id: updateCategoryDto.parentId,
                  },
                }
              : {
                  connect: {
                    id: updateCategoryDto.parentId,
                  },
                },
            level: category.level < 2 ? category.level + 1 : category.level,
            // name: updateCategoryDto.name,
          }
        : updateCategoryDto,
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
}
