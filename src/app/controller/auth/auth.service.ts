import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommonUtility } from 'src/utils/common.utility';
import { MemberDocument } from 'src/common/models/member.model';
import { MemberService } from './../member/member.service';
@Injectable()
export class AuthService {

  constructor(private readonly memberService: MemberService, private readonly jwtService:JwtService) {}
  async validateUser(username: string, password: string) {
    const user = await this.memberService.findUser({ username });
    const { hash } = CommonUtility.encryptBySalt(password, user?.password?.salt);
    if (!user || hash !== user?.password?.hash) {
      return null;
    }
    return user;
  }
 
  generateJwt(member: MemberDocument) {
    const { _id: id, username } = member;
    const payload = { id, username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * 
  public generateJwt(payload: UserPayload) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
   */
}
