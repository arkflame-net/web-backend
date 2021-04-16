import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { GoogleRecaptchaGuard } from "@nestlab/google-recaptcha";
import { Purchase } from './purchase.model';
import { PurchaseService } from "./purchase.service";
import { CreatePurchaseInput } from "./purchase.inputs";
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { GqlRoleGuard } from 'src/auth/guards/gql-role.guard';

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(private PurchaseService: PurchaseService) {}

  @Query(() => [Purchase])
  @UseGuards(GqlAuthGuard, GqlRoleGuard(["VIEW_PENDING_PURCHASES"]))
  public async fetchAllPurchases () {
    return this.PurchaseService.getAll();
  }

  @Query(() => [Purchase])
  @UseGuards(GqlAuthGuard, GqlRoleGuard(["VIEW_PENDING_PURCHASES"]))
  public async fetchRecentlyPendingPurchases () {
    return this.PurchaseService.getRecentlyPendingPurchases();
  }

  @Query(() => [Purchase])
  public async fetchRecentlyPurchases () {
    return this.PurchaseService.getRecentlyPurchases();
  }

  @Query(() => Purchase)
  public async fetchPurchaseByID (
    @Args('id') id: string,
  ) {
    const Purchase = this.PurchaseService.getByID(id);
    if (Purchase) {
      return Purchase;
    } else {
      throw new NotFoundException("Purchase with this ID doesn't exist");
    }
  }

  @UseGuards(GoogleRecaptchaGuard)
  @Mutation(() => Purchase)
  public async createPurchase (
    @Args('payload') payload: CreatePurchaseInput,
  ) {
    return this.PurchaseService.createPurchase(payload.items, payload.username, payload.method);
  }
}
