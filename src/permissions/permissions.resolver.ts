import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  FindManyPermissionArgs,
  FindUniquePermissionArgs,
  Permission,
} from '../shared/__generated__/prisma-nestjs-graphql';
import { BaseAuthResolver } from '../shared/resolvers/base-auth.resolver';
import { PermissionsService } from './permissions.service';

@Resolver(() => Permission)
export class PermissionsResolver extends BaseAuthResolver {
  constructor(private readonly permissionsService: PermissionsService) {
    super();
  }

  @Query(() => [Permission], { name: 'PermissionFindMany' })
  async findMany(@Args() args: FindManyPermissionArgs) {
    return await this.permissionsService.findMany(args);
  }

  @Query(() => Permission, { name: 'PermissionFindUnique' })
  async findUnique(@Args() args: FindUniquePermissionArgs) {
    const permission = await this.permissionsService.findUnique(args);
    if (!permission) throw new NotFoundException('Permission Not Found');
    return permission;
  }
}
