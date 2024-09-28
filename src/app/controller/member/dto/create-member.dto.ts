import { IsEmail,  MaxLength, MinLength } from 'class-validator';
import {
  MEMBER_PASSWORD_MAX_LEN,
  MEMBER_PASSWORD_MIN_LEN,
  MEMBER_USERNAME_MAX_LEN,
  MEMBER_USERNAME_MIN_LEN,
} from '../../../common/constants/member.const';

export class CreateMemberDto {
  @MinLength(MEMBER_USERNAME_MIN_LEN,{message:"用户名最小长度为:"+MEMBER_USERNAME_MIN_LEN})
  @MaxLength(MEMBER_USERNAME_MAX_LEN,{message:"用户名最大长度为:"+MEMBER_USERNAME_MAX_LEN})
  public readonly username: string;
  public readonly password: string;
  @IsEmail({},{message:"邮箱格式错误"})
  public readonly email: any;
  public readonly leval:string = "1";
  public readonly reocode:string = "1000";
  public readonly ctime:string;
  public readonly uptime:string;
  public readonly ip:string;
}
let timedata = new Date();
let localctime = timedata.toLocaleString();
export class CreateMsgDto {
  public readonly userId: string;
  public readonly msgcode: string;
  public readonly used:string = "0";
  public readonly ctime:string = localctime;
}

export class BaseMemberDto {
  public readonly id: string;
  public readonly username: string;
}
