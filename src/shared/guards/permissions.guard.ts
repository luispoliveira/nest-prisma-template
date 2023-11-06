import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RbacService } from '../../rbac/rbac.service';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { PermissionEnum } from '../enums/permission.enum';
import { ContextUtil } from '../utils/context.util';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) return true;

    const requestUser = ContextUtil.getRequest(context).user;
    if (!requestUser) return false;

    return await this.rbacService.userHasPermissions(
      requestUser.id,
      requiredPermissions,
    );
  }
}
