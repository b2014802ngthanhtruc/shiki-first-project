import { DefaultArgs } from '@prisma/client/runtime/library';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  private readonly _model: Prisma.CategoryDelegate<DefaultArgs>;

  constructor(private readonly prisma: PrismaService) {
    this._model = prisma.category;
  }

  async create(data: Prisma.CategoryCreateArgs) {
    return await this._model.create(data);
  }

  async findOne(params: Prisma.CategoryFindFirstArgs) {
    return await this._model.findFirst({
      ...params,
      include: {
        childCategories: true,
        parent: true,
      },
    });
  }

  async findMany(params: Prisma.CategoryFindManyArgs) {
    return this._model.findMany(params);
  }

  async count(params: Prisma.CategoryCountArgs) {
    return this._model.count(params);
  }

  async update(params: Prisma.CategoryUpdateArgs) {
    return this._model.update(params);
  }

  async delete(where: Prisma.CategoryWhereUniqueInput) {
    return this._model.delete({ where });
  }
}
