import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RecoverModel {
  @Field(() => String, { nullable: false })
  message: string = 'A reset email has been sent to your email.';
}
