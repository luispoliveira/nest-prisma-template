import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResetModel {
  @Field(() => String, { nullable: false })
  message: string = 'Your password has been updated.';
}
