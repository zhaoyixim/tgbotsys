import { AuthService } from '../../app/controller/auth/auth.service';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {  
  constructor(private readonly authService: AuthService) {
    super();
  }
  async validate(username: string, password: string) {   
    const user = await this.authService.validateUser(username, password); 
   // console.log("local stratage")  
    if (!user) {
      throw new ConflictException('用户名或密码错误');
    }
    return user;
  }

}