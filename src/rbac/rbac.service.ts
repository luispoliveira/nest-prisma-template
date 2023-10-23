import { Injectable } from '@nestjs/common';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class RbacService {
  constructor(private readonly permissionsService: PermissionsService) {}

  async userHasPermissions(
    userId: number,
    permissionName: string[],
  ): Promise<boolean> {
    const permission = await this.permissionsService.findFirst({
      where: {
        name: {
          in: permissionName,
        },
        Permissions2Users: {
          some: {
            userId: userId,
            isActive: true,
          },
        },
      },
    });

    return !!permission;
  }
}
