import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  FindManyPermissionArgs,
  Permission,
} from '../shared/__generated__/prisma-nestjs-graphql';
import { Permissions } from '../shared/decorators/permission.decorator';
import { PermissionEnum } from '../shared/enums/permission.enum';
import { BaseAuthResolver } from '../shared/resolvers/base-auth.resolver';
import { PermissionsService } from './permissions.service';

@Resolver(() => Permission)
export class PermissionsResolver extends BaseAuthResolver {
  constructor(private readonly permissionsService: PermissionsService) {
    super();
  }

  @Query(() => [Permission], { name: 'PermissionFindAll' })
  @Permissions(PermissionEnum.PERMISSION_READ)
  async findAll(@Args() args: FindManyPermissionArgs) {
    return await this.permissionsService.findMany(args);
  }
}
