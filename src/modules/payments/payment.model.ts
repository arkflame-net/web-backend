import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Purchase } from "../purchases/purchase.model";

@ObjectType()
@Schema()
export class Payment {
    @Field(() => ID)
    _id: string;

    @Field(() => Purchase)
    @Prop({ required: true, ref: "Purchase"  })
    purchase: Types.ObjectId;

    @Field()
    @Prop({ required: true })
    method: string;

    @Field()
    @Prop()
    paypalID: string;

    @Field()
    @Prop()
    redirectURL: string;
}

export type PaymentDocument = Payment & Document;
export const PaymentSchema = SchemaFactory.createForClass(Payment);
