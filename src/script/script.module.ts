import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Script, ScriptSchema } from './model/script.model';
import { ScriptResolver } from './script.resolver';
import { ScriptService } from './script.service';

@Module({
  providers: [ScriptResolver, ScriptService, JwtService],
  imports: [
    MongooseModule.forFeature([{ name: Script.name, schema: ScriptSchema }]),
    ConfigModule.forRoot({
      cache: true,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error(
            'JWT_SECRET is not defined in the environment variables.',
          );
        }
        return {
          secret,
          signOptions: { expiresIn: '24h' },
        };
      },
    }),
  ],
  exports: [ScriptService],
})
export class ScriptModule {}
