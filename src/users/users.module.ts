import { Module } from '@nestjs/common';
import { UsersCommand } from './users.command';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UsersCommand],
  exports: [UsersService],
})
export class UsersModule {}
