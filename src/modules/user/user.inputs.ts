import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsEmail, IsMongoId, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field(() => String)
    @Length(3, 16)
    @IsAlphanumeric()
    username: string;

    @Field(() => String)
    @Length(8, 256)
    password: string;

    @Field(() => String)
    @IsEmail()
    email: string;
}

@InputType()
export class AddRoleUserInput {
  @Field(() => String)
  @IsMongoId()
  user: string;

  @Field(() => String)
  @IsMongoId()
  role: string;
}
