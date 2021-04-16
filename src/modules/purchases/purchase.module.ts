import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from './purchase.model';
import { PurchaseResolver } from "./purchase.resolver";
import { PurchaseService } from "./purchase.service";
import { PurchaseItemModule } from '../purchaseitems/purchaseitem.module';
import { NestjsPaypalPayoutsModule } from "nestjs-paypal-payouts";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Purchase.name,
        schema: PurchaseSchema
      },
    ]),

    /*
    NestjsPaypalPayoutsModule.register({
      environment: process.env["NODE_EMV"] == "development" ? "sandbox" : "live",
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    }),
    */

    PurchaseItemModule,
  ],

  providers: [ PurchaseResolver, PurchaseService ],
  exports: [ PurchaseService ],
})
export class PurchaseModule {}
