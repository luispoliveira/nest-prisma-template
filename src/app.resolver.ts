import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }
}
