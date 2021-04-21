import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from './purchase.model';
import { PurchaseResolver } from "./purchase.resolver";
import { PurchaseService } from "./purchase.service";
import { PurchaseItemModule } from '../purchaseitems/purchaseitem.module';
import { PaymentModule } from "../payments/payment.module";

@Module({
  imports: [
    forwardRef(() => PaymentModule),
    MongooseModule.forFeature([
      {
        name: Purchase.name,
        schema: PurchaseSchema
      },
    ]),

    PurchaseItemModule,
  ],

  providers: [ PurchaseResolver, PurchaseService ],
  exports: [ PurchaseService ],
})
export class PurchaseModule {}
