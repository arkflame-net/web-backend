import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Payment } from '../payments/payment.model';
import { PaymentService } from "./payment.service";

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Mutation(() => Boolean)
  public async confirmPayment (
    @Args("paymentID") paymentID: string,
    @Args("payerID") payerID: string,
  ) {
    return this.paymentService.confirmPayment(paymentID, payerID);
  }
}
