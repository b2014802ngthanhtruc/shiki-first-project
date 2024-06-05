import { CategoryController } from './controllers/categories.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/categories.service';
import { Module } from '@nestjs/common';
import { ProductModule } from '@modules/products/product.module';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoriesModule {}
