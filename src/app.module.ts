import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';
import { EnvironmentEnum } from './shared/enums/environment.enum';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { CommandModule } from 'nestjs-command';
import { ApiKeysModule } from './api-keys/api-keys.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema,
    }),
    GraphQLModule.forRoot({
      debug: process.env.NODE_ENV === EnvironmentEnum.Development,
      playground: false,
      driver: ApolloDriver,
      plugins:
        process.env.NODE_ENV === EnvironmentEnum.Production
          ? [ApolloServerPluginLandingPageProductionDefault()]
          : [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      persistedQueries: false,
      autoSchemaFile: true,
      sortSchema: true,
    }),
    CommandModule,
    LoggerModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    ApiKeysModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
