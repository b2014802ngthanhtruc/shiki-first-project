import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserRepository } from './repositories/users.repository';

import { AdminJwtAccessAuthGuard } from '@modules/auth/guards/admin-jwt-access-auth.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, AdminJwtAccessAuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
