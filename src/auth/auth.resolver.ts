import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { User } from '../shared/__generated__/prisma-nestjs-graphql';
import { GetUser } from '../shared/decorators/get-user.decorator';
import { Public } from '../shared/decorators/is-public.decorator';
import { BaseAuthResolver } from '../shared/resolvers/base-auth.resolver';
import { UserValidate } from '../shared/types/user-validate.type';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Login } from './object-types/login.model';

@Resolver()
export class AuthResolver extends BaseAuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  @Mutation(() => Login, { name: 'AuthLogin' })
  @Public()
  async login(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ) {
    const user = await this.authService.validateUser(email, password);

    return await this.authService.login(user as User);
  }

  @Mutation(() => User, { name: 'AuthWhoAmI' })
  async whoAmI(@GetUser() user: UserValidate) {
    return await this.usersService.findUnique({
      where: {
        id: user.id,
      },
    });
  }

  @Mutation(() => Boolean, { name: 'AuthForgetPassword' })
  @Public()
  async forgetPassword(
    @Args({ name: 'email', type: () => String }) email: string,
  ) {
    return await this.authService.forgetPassword(email);
  }

  @Mutation(() => Boolean, { name: 'AuthRecoverPassword' })
  @Public()
  async recoverPassword(
    @Args({ name: 'token', type: () => String }) token: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ) {
    return await this.authService.recoverPassword(token, password);
  }

  @Mutation(() => Boolean, { name: 'AuthActivateAccount' })
  @Public()
  async activateAccount(
    @Args({ name: 'token', type: () => String }) token: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ) {
    return await this.authService.activateAccount(token, password);
  }
}
