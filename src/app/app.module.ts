import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { join } from 'path';
import { FestivalModule } from 'src/festival/festival.module';
import { ScriptModule } from 'src/script/script.module';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
// import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // playground: false,
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
      debug: process.env.NODE_ENV === 'testing',
      introspection: true,
      cache: 'bounded',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isTesting = process.env.NODE_ENV === 'testing';
        const uri = isTesting
          ? configService.get<string>('MONGODB_E2E_URI')
          : configService.get<string>('MONGODB_URI');
        const options: MongooseModuleOptions = {
          uri,
        };
        return options;
      },
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    UserModule,
    CommonModule,
    AuthModule,
    FestivalModule,
    ScriptModule,
  ],
  controllers: [],
})
export class AppModule {}
