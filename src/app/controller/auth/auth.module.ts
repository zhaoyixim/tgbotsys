import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MemberModule } from './../member';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule ,ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../../common/stratgies/jwt.strategy';
import { LocalStrategy } from '../../../common/stratgies/local.strategy';


@Module({
  imports: [
    PassportModule,
    MemberModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get('secrets.jwt');
        return {
          secret,
          signOptions: {
            expiresIn: '3660s'
          }
        };
      },
    })
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    LocalStrategy,JwtStrategy
  ],  
})
export class AuthModule {}
