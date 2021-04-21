import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Product } from './product.model';
import { ProductService } from "./product.service";

import { CreateProductInput } from "./product.inputs";
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from '../user/user.model';
import { GqlRoleGuard } from "../../auth/guards/gql-role.guard";

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  // @UseGuards(GqlAuthGuard, GqlRoleGuard(["CREATE_PRODUCT"]))
  @Mutation(() => Product)
  public async createProduct (
    @Args('payload') payload: CreateProductInput,
  ) {
    return this.productService.createProduct(payload);
  }

  @Query(() => [Product])
  public async fetchProductsByCategory (
    @Args('category') category: string,
  ) {
    return this.productService.getAllByCategory(category);
  }
}
