import { AdminJwtAccessAuthGuard } from '@modules/auth/guards/admin-jwt-access-auth.guard';
import { CategoryController } from './controllers/categories.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/categories.service';
import { Module } from '@nestjs/common';
import { SalerJwtAccessAuthGuard } from '@modules/auth/guards/saler-jwt-auth.guard';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    AdminJwtAccessAuthGuard,
    SalerJwtAccessAuthGuard,
  ],
  exports: [CategoryService, CategoryRepository],
})
export class CategoriesModule {}
