import { Module } from '@nestjs/common';
import { CategoryService } from './services/categories.service';
import { CategoryController } from './controllers/categories.controller';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoriesModule {}
