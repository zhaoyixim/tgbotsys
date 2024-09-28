import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDefinition } from '../../common/models/user.model';
import { JwtStrategy } from 'src/common/stratgies/jwt.strategy';
import { MemberDefinition } from 'src/common/models/member.model';
import { IpDefinition } from 'src/common/models/ip.model';
import { SysModule } from '../sys/sys.module';
@Module({
  imports: [
    MongooseModule.forFeature([UserDefinition]),
    MongooseModule.forFeature([MemberDefinition]),
    MongooseModule.forFeature([IpDefinition]),
    PassportModule,
    SysModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get('secrets.jwt');     
        return {
          secret,
          signOptions: {
            expiresIn: '3660s',
          },
        };
      },
    }),
],
  controllers: [UserController],
  providers: [UserService,JwtStrategy],
  exports:[UserService],
})
export class UserModule {}
