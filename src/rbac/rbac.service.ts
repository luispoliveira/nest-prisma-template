import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class RbacService {
  constructor(private readonly usersService: UsersService) {}

  async userHasPermissions(
    userId: number,
    permissionName: string[],
  ): Promise<boolean> {
    const permissions = await this.usersService.getUserPermissions(userId);

    return permissions.some((permission) =>
      permissionName.includes(permission),
    );
  }
}
