import { Module } from '@nestjs/common';
import { PermissionsResolver } from './permissions.resolver';
import { PermissionsService } from './permissions.service';

@Module({
  providers: [PermissionsService, PermissionsResolver],
  exports: [PermissionsService],
})
export class PermissionsModule {}
