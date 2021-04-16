import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Category } from './category.model';
import { CategoryService } from "./category.service";
import { CreateCategoryInput } from "./category.inputs";
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { GqlRoleGuard } from 'src/auth/guards/gql-role.guard';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => [Category])
  public async fetchAllCategories () {
    return this.categoryService.getAll();
  }

  @Query(() => Category)
  public async fetchCategoryByID (
    @Args('id') id: string,
  ) {
    const category = await this.categoryService.getByID(id);
    if (category) {
      return category;
    } else {
      throw new NotFoundException("Category with this ID doesn't exist");
    }
  }

  @Query(() => Category)
  public async fetchCategoryByShrug (
    @Args('shrug') shrug: string,
  ) {
    const category = await this.categoryService.getByShrug(shrug);
    if (category) {
      return category;
    } else {
      throw new NotFoundException("Category with this SHRUG doesn't exist");
    }
  }

  @UseGuards(GqlAuthGuard, GqlRoleGuard(["CREATE_CATEGORY"]))
  @Mutation(() => Category)
  public async createCategory (
    @Args('payload') payload: CreateCategoryInput,
  ) {
    return this.categoryService.createCategory(payload);
  }
}
