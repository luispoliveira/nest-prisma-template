import { Injectable } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import { UsersService } from './users.service';

@Injectable()
export class UsersCommand {
  constructor(private readonly usersService: UsersService) {}

  @Command({
    command: 'user:activate-user <userId>',
    describe: 'Activates an user',
  })
  async activateUser(
    @Positional({
      name: 'userId',
      describe: 'User internal ID',
      type: 'number',
    })
    userId: number,
  ) {
    await this.usersService.update({
      where: { id: userId },
      data: {
        isActive: true,
      },
    });
  }

  @Command({
    command: 'user:deactivate-user <userId>',
    describe: 'Deactivates an user',
  })
  async deactivateUser(
    @Positional({
      name: 'userId',
      describe: 'User internal ID',
      type: 'number',
    })
    userId: number,
  ) {
    await this.usersService.update({
      where: { id: userId },
      data: {
        isActive: false,
      },
    });
  }

  @Command({
    command: 'user:change-password <userId> <password>',
    describe: 'Changes user password',
  })
  async changeUserPassword(
    @Positional({
      name: 'userId',
      describe: 'User internal ID',
      type: 'number',
    })
    userId: number,
    @Positional({
      name: 'password',
      describe: 'New Password',
      type: 'string',
    })
    password: string,
  ) {
    await this.usersService.update({
      where: { id: userId },
      data: {
        password: password,
      },
    });
  }
}
