import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@ObjectType()
@Schema()
export class Product {
    @Field(() => ID)
    _id: string;

    @Field()
    @Prop({ type: String, required: true })
    name: string;

    @Field()
    @Prop({ type: Number, required: true })
    price: number;

    @Field()
    @Prop({ required: true })
    category: string;

    @Field()
    @Prop({ required: true })
    description: string;

    @Field(() => [String])
    @Prop({ required: true })
    commands: string[];
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
