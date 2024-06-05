import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class ProductRepository {
  private readonly _model: Prisma.ProductDelegate<DefaultArgs>;

  constructor(private readonly prisma: PrismaService) {
    this._model = prisma.product;
  }

  async create(data: Prisma.ProductCreateArgs) {
    return await this._model.create(data);
  }

  async findOne(params: Prisma.ProductFindFirstArgs) {
    return await this._model.findFirst(params);
  }

  async findMany(params: Prisma.ProductFindManyArgs) {
    return this._model.findMany(params);
  }

  async count(params: Prisma.ProductCountArgs) {
    return this._model.count(params);
  }

  async update(params: Prisma.ProductUpdateArgs) {
    return this._model.update(params);
  }

  async delete(where: Prisma.ProductWhereUniqueInput) {
    return this._model.delete({ where });
  }
}
