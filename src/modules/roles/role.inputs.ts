import { Field, InputType } from '@nestjs/graphql';
import { IsHexColor, Length } from 'class-validator';

@InputType()
export class CreateRoleInput {
    @Field(() => String)
    @Length(1, 32)
    name: string;

    @Field(() => String)
    @IsHexColor()
    color: string;

    @Field(() => String)
    @IsHexColor()
    background: string;

    @Field(() => [String])
    permissions: string[];
}
