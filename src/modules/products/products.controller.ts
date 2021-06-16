import { BadRequestException, Controller, Get, Param, Query, Req } from '@nestjs/common';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { Request } from 'express';

@Controller('/v1/products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get()
    getAll(): Promise<Product[]> {
        return this.productService.getAll();
    }

    @Get("/many")
    getMany(@Req() req: Request): Promise<Product[]> {
        let { ids } = req.query;
        if (ids) {
            ids = (ids as string).split(",");
        }

        if (ids == null || !Array.isArray(ids)) {
            throw new BadRequestException("You need to specify a 'ids' query of type Array of String.");
        }

        return this.productService.queryManyByID(ids as string[]);
    }

    @Get(":id")
    getByID(@Param() params, @Req() request: Request): Promise<Product> {
        return this.productService.getByID(params.id);
    }
}