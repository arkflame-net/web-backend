import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase, PurchaseDocument } from "./purchase.model";
import { PurchaseItemService } from "../purchaseitems/purchaseitem.service";
import { InjectPaypalClient, InjectPaypal } from "nestjs-paypal-payouts";

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name)
    private readonly PurchaseModel: Model<PurchaseDocument>,
    /*
    @InjectPaypalClient()
    private readonly paypalClient,
    @InjectPaypal()
    private readonly paypal,
    */
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

  public async createPurchase (basket: any, buyer: string, method: string): Promise<Purchase> {
    const items = [];

    const purchase = new this.PurchaseModel({
      items, buyer, method
    });

    await purchase.save();
    return purchase.populate([
      {
        path: "items",
        model: "PurchaseItem",
        populate: {
          path: "product",
          model: "Product"
        }
      }
    ]).execPopulate()
  }
}
