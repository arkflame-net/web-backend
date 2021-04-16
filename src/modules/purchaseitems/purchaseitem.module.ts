import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseItem, PurchaseItemSchema } from './purchaseitem.model';
import { PurchaseItemResolver } from "./purchaseitem.resolver";
import { PurchaseItemService } from "./purchaseitem.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PurchaseItem.name,
        schema: PurchaseItemSchema
      },
    ])
  ],

  providers: [ PurchaseItemResolver, PurchaseItemService ],
  exports: [ PurchaseItemService ],
})
export class PurchaseItemModule {}
