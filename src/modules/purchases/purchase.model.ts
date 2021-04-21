import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PurchaseItem } from "../purchaseitems/purchaseitem.model";

@ObjectType()
@Schema({ timestamps: true })
export class Purchase {
    @Field(() => ID)
    _id: string;

    @Field()
    _createdAt: Date;

    @Field(() => [PurchaseItem])
    @Prop({ required: true, ref: "PurchaseItem" })
    // Ids of items bought in this purchase
    items: Types.ObjectId[];

    @Field()
    @Prop({ required: true })
    // Id of the user who bought
    buyer: string;

    @Field()
    @Prop({ default: "PENDING" })
    status: string;
}

export type PurchaseDocument = Purchase & Document;
export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
