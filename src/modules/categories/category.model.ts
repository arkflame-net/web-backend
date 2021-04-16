import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema()
export class Category {
    @Field(() => ID)
    _id: string;

    @Field()
    @Prop({ type: String, unique: true, required: true })
    shrug: string;

    @Field()
    @Prop({ type: String, required: true })
    name: string;

    @Field()
    @Prop({ required: true })
    description: string;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
