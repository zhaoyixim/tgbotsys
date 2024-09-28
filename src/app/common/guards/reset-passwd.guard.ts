import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { MemberService } from '../../controller/member/member.service';

@Injectable()
export class ResetpasswdGuard implements CanActivate {
  constructor(private readonly memberService: MemberService) {}
   async canActivate(context: ExecutionContext,): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    let { body } = request;
    if(!body.email)  throw new ConflictException('请输入邮箱');
    if(body.password != body.confirmpasswd) throw new ConflictException("两次输入密码不匹配");
    let userinfo =  await this.memberService.findByOtherKey({email:body.email});
    if(!userinfo) throw new ConflictException('暂无此用户');
    //添加进去userid
    body._id = userinfo._id;
    let userId = userinfo._id;   
    let checkmsgcode =  await this.memberService.findMsgCode(userId.toString(),body.msgcode);
    if(!checkmsgcode) throw new ConflictException('验证码错误');
      //添加进去userid
    body.msgid = checkmsgcode._id;
    return true;
  }
}