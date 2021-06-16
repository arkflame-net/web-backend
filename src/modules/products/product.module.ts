import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.model';
import { ProductResolver } from "./product.resolver";
import { ProductService } from "./product.service";
import { ProductController } from './products.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema
      },
    ])
  ],

  controllers: [ ProductController ],
  providers: [ ProductResolver, ProductService ],
  exports: [ ProductService ],
})
export class ProductModule {}
