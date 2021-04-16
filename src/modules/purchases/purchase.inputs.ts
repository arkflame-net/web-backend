import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsEnum, IsInt, Length, IsMongoId, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

enum PaymentMethods {
  paypal, mercadopago
}

@InputType()
export class ItemInput {
    @Field(() => String)
    @IsMongoId()
    id: string;

    @Field(() => Number)
    @IsInt()
    @Min(1)
    @Max(99)
    amount: number;
}

@InputType()
export class CreatePurchaseInput {
    @Field(() => String)
    @Length(3, 16)
    @IsAlphanumeric()
    username: string;

    @Field(() => String)
    @IsEnum(PaymentMethods)
    method: string;

    @Field(() => [ItemInput])
    @ValidateNested()
    @Type(() => ItemInput)
    items: ItemInput[];
}
