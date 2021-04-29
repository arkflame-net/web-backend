import { Request } from 'express';
import { Controller, Post, Req, BadRequestException } from '@nestjs/common';
import { ProductService } from "../modules/products/product.service";

@Controller("basket")
export class BasketController {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Post("calculate")
    public async calculate(
        @Req() req: Request
    ) {
        const { basket } = req.body;
        let price = 0;

        for (let basketItem of basket) {
            const { id, quantity } = basketItem;
            const product = await this.productService.getByID(id);
            const productPrice = product.price;
            
            price += quantity * productPrice;
        }

        return { price }
    }
}