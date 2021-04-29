import { Module } from '@nestjs/common';
import { ProductModule } from "src/modules/products/product.module";
import { BasketController } from "./basket.controller";

@Module({
  imports: [
    ProductModule
  ],
  controllers: [BasketController]
})
export class BasketModule {}