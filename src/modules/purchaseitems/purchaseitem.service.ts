import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PurchaseItem, PurchaseItemDocument } from "./purchaseitem.model";
import { ProductService } from "../products/product.service";
@Injectable()
export class PurchaseItemService {
  constructor(
    @InjectModel(PurchaseItem.name)
    private readonly PurchaseItemModel: Model<PurchaseItemDocument>,
    private readonly productService: ProductService,
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

  public async createPurchaseItem (productID: string, amount: number): Promise<PurchaseItem> {
    const product = await this.productService.getByID(productID);
    if (!product) {
      throw new BadRequestException("Product with ID " + productID + " isn't exist.", "PRODUCT_NOT_FOUND");
    }

    const item = new this.PurchaseItemModel({
      product, amount
    });

    return item;
  }
}
