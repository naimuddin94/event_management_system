import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Festival, FestivalSchema } from './entities/festival.entity';
import { FestivalResolver } from './festival.resolver';
import { FestivalService } from './festival.service';

@Module({
  providers: [FestivalResolver, FestivalService, JwtService],

  imports: [
    MongooseModule.forFeature([
      { name: Festival.name, schema: FestivalSchema },
    ]),
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
  exports: [FestivalService],
})
export class FestivalModule {}
