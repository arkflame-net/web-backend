import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase, PurchaseDocument } from "./purchase.model";
import { PurchaseItemService } from "../purchaseitems/purchaseitem.service";
import { PaymentService } from "../payments/payment.service";
import { Payment } from '../payments/payment.model';
@Injectable()
export class PurchaseService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    @InjectModel(Purchase.name)
    private readonly PurchaseModel: Model<PurchaseDocument>,
    private readonly purchaseItemService: PurchaseItemService,
  ) {}

  public query (payload: any): Promise<Purchase> {
    return this.PurchaseModel.findOne(payload).populate([
      {
        path: "items",
        model: "PurchaseItem",
        populate: {
          path: "product",
          model: "Product"
        }
      }
    ]).exec();
  }

  public async queryAll (payload: any, limit?: number): Promise<Purchase[]> {
    return this.PurchaseModel.find(payload).populate([
      {
        path: "items",
        model: "PurchaseItem",
        populate: {
          path: "product",
          model: "Product"
        }
      }
    ]).limit(limit || 99).exec();
  }

  public getAll (): Promise<Purchase[]> {
    return this.queryAll({});
  }

  public getByID (_id: string): Promise<Purchase> {
    return this.query({ _id });
  }

  public getRecentlyPurchases () {
    return this.queryAll({
      status: "APPROVED"
    }, 10);
  }

  public getRecentlyPendingPurchases () {
    return this.queryAll({
      status: "PENDING"
    }, 10);
  }

  public async createPurchase (basket: any, buyer: string, method: string): Promise<Payment> {
    const items = [];
    const itemIDS = [];

    for (const product of basket) {
      const item = await this.purchaseItemService.createPurchaseItem(product.id, product.amount);
      items.push(item);
    }

    for (const item of items) {
      await item.save();
      itemIDS.push(item._id);
    }

    const purchase = new this.PurchaseModel({
      items: itemIDS, buyer, method, status: "PENDING"
    });

    await purchase.save();
    await purchase.populate([
      {
        path: "items",
        model: "PurchaseItem",
        populate: {
          path: "product",
          model: "Product"
        }
      }
    ]).execPopulate();

    const payment = await this.paymentService.createPaypalPayment(purchase);
    return payment;
  }
}
