import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JoiValidationPipe } from '@common/pipes';
import { UpdateUserValidator } from '../validators/update-user-dto.validator';
import { CreateUserValidator } from '../validators/create-user-dto.validator';
import { AdminJwtAccessAuthGuard } from '@modules/auth/guards/admin-jwt-access-auth.guard';
import { JwtAccessAuthGuard } from '@modules/auth/guards';
import { query } from 'express';
import { BaseQueryParams } from '@common/dtos';
import { BaseQueryParamsValidator } from '@common/validators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body(new JoiValidationPipe(CreateUserValidator))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AdminJwtAccessAuthGuard)
  @Get()
  findAll(
    @Query(new JoiValidationPipe(BaseQueryParamsValidator))
    query: BaseQueryParams,
  ) {
    return this.usersService.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // @UseGuards(JwtAccessAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateUserValidator))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AdminJwtAccessAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
