import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Purchase } from "../purchases/purchase.model";
import { createSaleFromPurchase } from "../../utils/payment.utils";
import paypal from 'paypal-rest-sdk';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './payment.model';
import { Model } from 'mongoose';
import { sendPurchaseToGateway } from "../../utils/gateway.utils";
import { PurchaseService } from '../purchases/purchase.service';

paypal.configure({
  'mode': process.env.NODE_ENV === "production" ? "live" : "sandbox",
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET,
});


@Injectable()
export class PaymentService {
  constructor (
    @Inject(forwardRef(() => PurchaseService))
    private readonly purchaseService: PurchaseService,

    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>
  ) {}

  private _createPayment(sale): Promise<paypal.PaymentResponse> {
    return new Promise((resolve, reject) => {
        paypal.payment.create(sale, (err, payout) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(payout);
            }
        })
    });
  }

  private _confirmPayment (paymentId: string, payerID: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, { 'payer_id': payerID }, async function (error, payment) {
        if (error) {
          console.error(error);
          reject("Internal server error, contact an administrator");
        } else {
          if (payment.state == "approved") {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    })
  }

  public query (payload) {
    return this.paymentModel.findOne(payload);
  }

  public async confirmPayment (paymentID: string, payerID: string): Promise<boolean> {
    const payment = await this.query({paypalID: paymentID});
    if (!payment) {
      throw new BadRequestException("Payment with this ID is invalid", "PAYMENT_ID_INVALID");
    }

    const purchase = await this.purchaseService.query({_id: payment.purchase});
    // if (purchase["status"] != "PENDING") {
    //   throw new BadRequestException("This payment is already " + purchase["status"], "PAYMENT_ALREADY_" + purchase["status"]);
    // }

    const isValid = await this._confirmPayment(paymentID, payerID);
    if (isValid) {
      purchase.status = "APPROVED";
      sendPurchaseToGateway(purchase);
      return true;
    } else {
      throw new BadRequestException("Invalid payment", "INVALID_PAYMENT");
    }
  }

  public async createPaypalPayment (purchase: Purchase) {
    const sale = createSaleFromPurchase(purchase);
    const paypalPayment = await this._createPayment(sale);

    let id = paypalPayment.id;
    let links = paypalPayment.links

    for (let i = --links.length; i > 0; i--) {
      let link = links[i];

      if (link != undefined && link.method == "REDIRECT") {
        const payment = new this.paymentModel({
          purchase: purchase._id,
          method: "paypal",
          paypalID: id,
          redirectURL: link.href
        });

        await payment.save();
        return this.query({_id: payment._id});
      }
    }
  }
}
