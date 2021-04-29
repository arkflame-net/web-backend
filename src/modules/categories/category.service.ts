import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from "./category.model";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>
  ) {}

  public query (payload: any): Promise<Category> {
    return this.categoryModel.findOne(payload).exec();
  }

  public queryAll (payload: any): Promise<Category[]> {
    return this.categoryModel.find(payload).exec();
  }

  public getAll (): Promise<Category[]> {
    return this.queryAll({});
  }

  public getByID (_id: string): Promise<Category> {
    return this.query({ _id });
  }

  public getByShrug (shrug: string): Promise<Category> {
    return this.categoryModel.findOne({
      shrug
    }).exec();
  }

  public createCategory (payload): Promise<Category> {
    const category = new this.categoryModel(payload);
    return category.save();
  }

  public removeCategory (payload): Promise<Category> {
    const id = payload.id;

    return this.categoryModel.findByIdAndDelete({ id }).exec();
  }
}
