import { Field, InputType } from '@nestjs/graphql';
import { Length, IsAlphanumeric } from 'class-validator';

@InputType()
export class CreateCategoryInput {
    @Field(() => String)
    @Length(1, 32)
    name: string;

    @Field(() => String)
    @Length(1, 2000)
    description: string;

    @Field(() => String)
    @Length(1, 48)
    @IsAlphanumeric()
    shrug: string;
}

@InputType()
export class RemoveCategoryInput {
    @Field(() => String)
    @Length(1, 32)
    id: string;
}
