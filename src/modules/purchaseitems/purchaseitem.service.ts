import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PurchaseItem, PurchaseItemDocument } from "./purchaseitem.model";

@Injectable()
export class PurchaseItemService {
  constructor(
    @InjectModel(PurchaseItem.name)
    private readonly PurchaseItemModel: Model<PurchaseItemDocument>
  ) {}

  public query (payload: any): Promise<PurchaseItem> {
    return this.PurchaseItemModel.findOne(payload).exec();
  }

  public queryAll (payload: any): Promise<PurchaseItem[]> {
    return this.PurchaseItemModel.find(payload).exec();
  }

  public getAll (): Promise<PurchaseItem[]> {
    return this.queryAll({});
  }

  public getByID (_id: string): Promise<PurchaseItem> {
    return this.query({ _id });
  }

  public getAllByCategory (category: string): Promise<PurchaseItem[]> {
    return this.queryAll({ category });
  }

  public createPurchaseItem (product: string, amount: number): Promise<PurchaseItem> {
    const item = new this.PurchaseItemModel({
      product, amount
    });

    return item.save();
  }
}
