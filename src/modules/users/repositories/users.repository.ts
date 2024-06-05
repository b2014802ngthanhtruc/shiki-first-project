import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class UserRepository {
  private readonly _model: Prisma.UserDelegate<DefaultArgs>;

  constructor(private readonly prisma: PrismaService) {
    this._model = prisma.user;
  }

  async create(data: Prisma.UserCreateInput) {
    return await this._model.create({ data });
  }

  async findOne(params: Prisma.UserFindFirstArgs) {
    return this._model.findFirst(params);
  }

  async findMany(params: Prisma.UserFindManyArgs) {
    return this._model.findMany(params);
  }

  async count(params: Prisma.UserCountArgs) {
    return this._model.count(params);
  }

  async update(params: Prisma.UserUpdateArgs) {
    return this._model.update(params);
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    return this._model.delete({ where });
  }
}
