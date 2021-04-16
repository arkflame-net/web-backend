import { NotFoundException } from '@nestjs/common';
import { Args, Resolver, Query } from '@nestjs/graphql';
import { PurchaseItem } from './purchaseitem.model';
import { PurchaseItemService } from "./purchaseitem.service";

@Resolver(() => PurchaseItem)
export class PurchaseItemResolver {
  constructor(private PurchaseItemService: PurchaseItemService) {}

  @Query(() => PurchaseItem)
  public async fetchPurchaseItemByID (
    @Args('id') id: string,
  ) {
    const Purchase = this.PurchaseItemService.getByID(id);
    if (PurchaseItem) {
      return PurchaseItem;
    } else {
      throw new NotFoundException("PurchaseItem with this ID doesn't exist");
    }
  }
}
