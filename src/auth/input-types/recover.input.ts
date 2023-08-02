import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class RecoverInput {
  @Field(() => String, { nullable: false })
  @IsEmail()
  email: string;
}
