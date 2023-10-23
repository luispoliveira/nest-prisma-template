import { Global, Module } from '@nestjs/common';
import { PermissionsResolver } from './permissions.resolver';
import { PermissionsService } from './permissions.service';

@Global()
@Module({
  providers: [PermissionsService, PermissionsResolver],
  exports: [PermissionsService],
})
export class PermissionsModule {}
