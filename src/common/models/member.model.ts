import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {  MEMBER_USERNAME_MIN_LEN,  MEMBER_USERNAME_MAX_LEN} from '../../app/common/constants/member.const';

export type MemberDocument = Member & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();

@Schema({ versionKey: false })
export class Member {
      @Prop({
        required: true,
        minlength: MEMBER_USERNAME_MIN_LEN,
        maxlength: MEMBER_USERNAME_MAX_LEN,
      })
      username: string; 

      @Prop({
        required: false,
        minlength: MEMBER_USERNAME_MIN_LEN,
        maxlength: MEMBER_USERNAME_MAX_LEN,
      })
      nickname: string; 
      /**是否在线 -多少时间不登录就置false*/
      @Prop({
        required: false,
        type:Boolean,
        default:true
      })
      active: boolean;
      /*头像 */
      @Prop({
        required: false,
        default:"/src/assets/avatar.jpg"
      })
      avatar: string;

      @Prop({
        required: true,
      })
      email: string;
      @Prop({
        required: true,
        type: raw({
          hash: String,
          salt: String,
        }),
      })
      password: { hash: string; salt: string };
      
      /**角色标识 0 - 普通用户 1-U商身份*/
      @Prop({
        required: false,
        type:String,
        default:"0",
      })
      roleFlag: string;
      /**信誉保证--过程后面在设计 0--为信誉度问题-有过争议*/
      @Prop({
        required: false,
        type:Number,
        default:1,
      })
      creditLevel: number;
      /*** 用户等级*/
      @Prop({
        required:false,
        type:Number,
        default:1
      })
      level: number;
      /*** 验证等级*/
      @Prop({
        required:false,
        type:Number,
        default:1
      })
      verifyLevel: number;

     /*** 邮箱是否验证*/
      @Prop({
        required:false,
        type:Boolean,
        default:false
      })
      checkemail: boolean ;
      
       /** 用户净总资产 USDT */
       @Prop({
        required:false,
        type:Number,
        default:0
      })
      usdtAll: number ;
      /** 用户能动用的资产 USDT */
      @Prop({
        required:false,
        type:Number,
        default:"0"
      })
      usdt: number ;
       /** 冻结的 USDT */
       @Prop({
        required:false,
        type:Number,
        default:0
      })
      freezeUsdt: number ;
      /** 保证金 */
      @Prop({
        required:false,
        type:Number,
        default:0
      })
      freezeBail: number ;
      

      /** 冻结的 USDT --卖出的时候专用*/
       @Prop({
        required:false,
        type:Number,
        default:0
      })
      freezeOutUsdt: number ;

      /** 冻结的TRX */
      @Prop({
        required:false,
        type:Number,
        default:0
      })
      freezeTrx: number ;
    
      /** 未完成的数量 */
      @Prop({
        required:false,
        type:Number,
        default:0
      })
      unfinishednum: number ;

      /** 用户净总资产 TRX */
       @Prop({
        required:false,
        type:Number,
        default:0
      })
      trxAll: number ;

      /** 用户净资产 TRX */
      @Prop({
        required:false,
        type:Number,
        default:0
       })
      trx: number ;
      /**保证金 --- 信誉保证金 -不是业务冻结金 */
      @Prop({
        required:false,
        type:Number,
        default:0
      })
      bailNums: number ;

      /** 最近使用提现地址 */
      @Prop({
        required:false,
        type:String,
        default:"0"
      })
      address: string ;

      /**自我介绍 */
      @Prop({
        required:false,
        type:String,
        default:"你还没有向大家介绍自己",
      })
      introduction: string;

      /**推荐码-默认1000 */
      @Prop({
        required:false,
        type:String,
        default:"1000"
      })
      recode: string;

      /**登录次数 */
      @Prop({
        required:false,
        type:String,
        default:"0"
      })
      logintimes: string;

       /**登录IP */
       @Prop({
        required:false,
        type:String,
        default:""
      })
      ips: string;
    
      @Prop({
        required:false,
        type:String,
        default:localctime
      })
      ctime:string;

      /*更改密码的更新数据 */
      @Prop({
        required:false,
        type:String,
        default:""
      })
      uptime:string;

    /**登录更新数据 */  
      @Prop({
        required:false,
        type:String,
        default:localctime
      })
      logintime:string;      
    /*** 是否在黑名单*/
    @Prop({
      required:false,
      type:Boolean,
      default:false
    })
    inblacklist: Boolean;

}
export const MemberSchema = SchemaFactory.createForClass(Member);
export const MEMBER_MODEL_TOKEN = Member.name;
export const MemberDefinition: ModelDefinition = {
  name: MEMBER_MODEL_TOKEN,
  schema: MemberSchema,
};