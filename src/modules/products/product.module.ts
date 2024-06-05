import { CategoriesModule } from '@modules/categories/categories.module';
import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';

@Module({
  imports: [CategoriesModule],
  controllers: [ProductController],
  providers: [ProductRepository, ProductService],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
