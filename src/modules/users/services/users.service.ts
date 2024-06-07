import { BadRequestException, Injectable, Search } from '@nestjs/common';

import { BaseQueryParams } from '@common/dtos';
import { CreateUserDto } from '../dto/create-user.dto';
import { USER_ERROR } from 'src/content/errors/user.error';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly _userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this._userRepository.findOne({
      where: {
        email: createUserDto.email,
        deletedAt: null,
      },
    });
    console.log(user);
    if (!user) {
      const result = await this._userRepository.create(createUserDto);
      delete result.password;
      return result;
    }
    throw new BadRequestException('Email is already exist');
  }

  async findMany(params: BaseQueryParams) {
    console.log(params);
    const result = {
      count: await this._userRepository.count({}),
      data: await this._userRepository.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        where: params.search
          ? {
              OR: [
                { firstName: { contains: params.search, mode: 'insensitive' } },
                { lastName: { contains: params.search, mode: 'insensitive' } },
                { email: { contains: params.search, mode: 'insensitive' } },
              ],
            }
          : undefined,
        orderBy: params.sort
          ? Object.entries(params.sort).map(([key, value]) => ({
              [key]: value,
            }))
          : undefined,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          adminStatus: true,
          salerStatus: true,
          userStatus: true,
          isAdmin: true,
          isSaler: true,
          isUser: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      }),
    };
    return result;
  }

  async findByEmail(email: string) {
    const result = await this._userRepository.findOne({
      where: {
        email: email,
        deletedAt: null,
      },
    });
    return result;
  }

  async findOne(id: string) {
    const result = await this._userRepository.findOne({
      where: {
        id,
      },
    });
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const result = await this._userRepository.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
    delete result.password;
    return result;
  }

  async remove(id: string) {
    const user = this._userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new BadRequestException(USER_ERROR.USER_01);

    await this._userRepository.delete({
      id,
    });
    return 'Success';
  }

  saveResetCode(id: string, resetCode: string) {
    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + 3);
    return this._userRepository.update({
      where: {
        id,
      },
      data: {
        resetCode,
        expireAt,
      },
    });
  }

  findResetCode(code: string) {
    return this._userRepository.findOne({
      where: {
        resetCode: code,
        expireAt: {
          gt: new Date(),
        },
      },
    });
  }

  cleanResetCode(id: string) {
    return this._userRepository.update({
      where: {
        id,
      },
      data: {
        resetCode: null,
        expireAt: null,
      },
    });
  }

  updatePassword(id: string, password: string) {
    return this._userRepository.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  }
}
