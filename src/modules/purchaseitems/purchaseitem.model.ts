import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from "../products/product.model";

@ObjectType()
@Schema()
export class PurchaseItem {
    @Field(() => ID)
    _id: string;

    @Field(() => Product)
    @Prop({ required: true, ref: "Product" })
    // Id of product
    product: Types.ObjectId;

    @Field()
    @Prop({ default: 0 })
    // Amount of that product
    amount: number;
}

export type PurchaseItemDocument = PurchaseItem & Document;
export const PurchaseItemSchema = SchemaFactory.createForClass(PurchaseItem);
