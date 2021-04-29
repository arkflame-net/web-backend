import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from "./product.model";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>
  ) {}

  public query (payload: any): Promise<Product> {
    return this.productModel.findOne(payload).exec();
  }

  public queryAll (payload: any): Promise<Product[]> {
    return this.productModel.find(payload).exec();
  }

  public getAll (): Promise<Product[]> {
    return this.queryAll({});
  }

  public getByID (_id: string): Promise<Product> {
    return this.query({ _id });
  }

  public getAllByCategory (category: string): Promise<Product[]> {
    return this.queryAll({ category });
  }

  public createProduct (payload): Promise<Product> {
    const product = new this.productModel(payload);
    return product.save();
  }

  public removeProduct (payload): Promise<Product> {
    const id = payload.id
    return this.productModel.findByIdAndDelete({id}).exec();
  }
}
