import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetInput {
  @Field(() => String, { nullable: false })
  resetToken: string;
  @Field(() => String, { nullable: false })
  password: string;
}
