import { BadRequestException, Injectable, Search } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/users.repository';
import { USER_ERROR } from 'src/content/errors/user.error';
import { BaseQueryParams } from '@common/dtos';

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
      return this._userRepository.create(createUserDto);
    }
    throw new BadRequestException('Email is already exist');
  }

  findMany(params: BaseQueryParams) {
    console.log(params);
    return this._userRepository.findMany({
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
        ? Object.entries(params.sort).map(([key, value]) => ({ [key]: value }))
        : undefined,
    });
  }

  findByEmail(email: string) {
    return this._userRepository.findOne({
      where: {
        email: email,
        deletedAt: null,
      },
    });
  }

  findOne(id: string) {
    return this._userRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this._userRepository.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    const user = this._userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new BadRequestException(USER_ERROR.USER_01);

    return this._userRepository.delete({
      id,
    });
  }

  saveResetCode(id: string, resetCode: string) {
    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + 1);
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
