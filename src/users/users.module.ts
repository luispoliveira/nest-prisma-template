import { Global, Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UsersCommand } from './users.command';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Global()
@Module({
  providers: [UsersService, UsersCommand, ProfilesService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
