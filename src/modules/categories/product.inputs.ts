import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
    @Field(() => String)
    name: string;

    @Field(() => Number)
    price: number;

    @Field(() => String)
    description: string;

    @Field(() => String)
    brief: string;

    @Field(() => String)
    category: string;
}
