import { PaymentService } from './payment.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from "./payment.model";
import { PaymentResolver } from "./payment.resolver";
import { PurchaseModule } from '../purchases/purchase.module';

@Module({
    imports: [
      forwardRef(() => PurchaseModule),
      MongooseModule.forFeature([
        {
          name: Payment.name,
          schema: PaymentSchema
        },
      ]),
    ],
    controllers: [],
    providers: [PaymentResolver, PaymentService],
    exports: [PaymentService],
})
export class PaymentModule {}
