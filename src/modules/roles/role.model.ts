import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HookNextFunction, Types } from 'mongoose';

@ObjectType()
@Schema()
export class Role {
  @Field(() => ID)
  _id: string

  @Field()
  @Prop({ default: "New Role" })
  name: string

  @Field()
  @Prop({ default: "fff" })
  color: string

  @Field()
  @Prop({ default: "000" })
  background: string

  @Field(() => [String])
  @Prop({ default: [] })
  permissions: string[]
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);
