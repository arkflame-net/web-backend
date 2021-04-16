import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HookNextFunction, Types } from 'mongoose';
import { Role } from "../roles/role.model";
import * as bcrypt from 'bcrypt';

@ObjectType()
@Schema()
export class User {
  @Field(() => ID)
  _id: string

  @Field()
  @Prop({ required: true, unique: true })
  username: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true })
  password: string;

  @Field(() => [Role])
  @Prop({ required: true, ref: "Role" })
  roles: Types.ObjectId[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: HookNextFunction) {
  try {
    if (this.isModified('password')) {
      const hashed = await bcrypt.hash(this['password'], 10);
      this['password'] = hashed;
    }

    next();
  } catch (e) {
    return next(e);
  }
})
