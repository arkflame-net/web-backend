import { Field, InputType } from '@nestjs/graphql';
import { Length, Max, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
    @Field(() => String)
    @Length(1, 64)
    name: string;

    @Field(() => Number)
    @Min(0.25)
    @Max(999.99)
    price: number;

    @Field(() => String)
    @Length(1, 2000)
    description: string;

    @Field(() => String)
    @Length(1, 255)
    brief: string;

    @Field(() => String)
    category: string;

    @Field(() => [String])
    commands: string[];
}

@InputType()
export class RemoveProductInput {
    @Field(() => String)
    id: string;
}
