import { UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import {
  User,
  UserCreateInput,
} from '../shared/__generated__/prisma-nestjs-graphql';
import { BasePublicResolver } from '../shared/resolvers/base-public.resolver';
import { AuthService } from './auth.service';
import { LoginInput } from './input-types/login.input';
import { RecoverInput } from './input-types/recover.input';
import { ResetInput } from './input-types/reset.input';
import { Login } from './object-types/login.model';
import { RecoverModel } from './object-types/recover.model';
import { ResetModel } from './object-types/reset.model';

@Resolver()
export class AuthResolver extends BasePublicResolver {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Mutation(() => Login, { name: 'AuthLogin' })
  async login(@Args('loginInput') loginInput: LoginInput) {
    const user = await this.authService.validateUser(
      loginInput.username,
      loginInput.password,
    );

    if (!user || !user.isActive)
      throw new UnauthorizedException('User not found or inactive');

    return await this.authService.login(user as User);
  }

  @Mutation(() => User, { name: 'AuthSignUp' })
  signUp(@Args('signUpInput') userCreateInput: UserCreateInput) {
    return this.authService.signUp({
      username: userCreateInput.username,
      email: userCreateInput.email,
      password: userCreateInput.password,
    });
  }

  @Mutation(() => RecoverModel, { name: 'AuthRecoverPassword' })
  async recoverPassword(@Args('recoverInput') recoverInput: RecoverInput) {
    await this.authService.recoverPassword(recoverInput.email);
    return { message: 'A reset email has been sent to your email.' };
  }

  @Mutation(() => ResetModel, { name: 'AuthResetPassword' })
  async resetPassword(@Args('resetInput') resetInput: ResetInput) {
    await this.authService.resetPassword(
      resetInput.resetToken,
      resetInput.password,
    );
    return {
      message: 'Your password has been updated.',
    };
  }
}
