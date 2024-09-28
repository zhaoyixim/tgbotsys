import { CommonUtility } from 'src/utils/common.utility';
import { AuthGuard } from '@nestjs/passport';
import { Controller,Req,Post,Param,Get, Body, UseGuards, ConflictException } from '@nestjs/common';
import { MemberService } from './member.service';
import { BaseMemberDto, CreateMemberDto, CreateMsgDto } from './dto/create-member.dto';
import { Request } from 'express';
import { MemberDocument } from '../../../common/models/member.model';
import { ResetpasswdGuard } from '../../common/guards/reset-passwd.guard';
import { UpdateMemberDto } from './dto/update-member.dto';
import { RealIP } from 'nestjs-real-ip';
import { SysService } from 'src/backend/controller/sys/sys.service';


@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService,
    private readonly sysService: SysService,
    ) {}

  @Post('/reg')
  signup(@Body() member: CreateMemberDto,@RealIP() ip: string) {
   return this.memberService.createMember(member,ip);
  }

  /**修改头像 */
  @UseGuards(AuthGuard('jwt'))

  @Post('/deleteavatar')
  changeavatar(@Req() request: Request) {
    const user = request.user as BaseMemberDto 
    return this.memberService.setDefaultAvatar(user.id);
  }

  @Post('/sendcode')
  public async sendMsg(@Body() emailData:any){
      //通过邮箱发送验证码
      let k  = Math.random()*(999999-100000)+100000;
      let smgcode = parseInt(k.toString(),10);
      let getinfo = await this.memberService.findByOtherKey({email:emailData.email}) 
      if(!getinfo) { throw new ConflictException('无此账号');};
        //添加验证码数据

        //发送邮件

        
       // console.log(getinfo);


      let timedata = new Date();
      let localctime = timedata.toLocaleString();

      let saveData = {
        userId:getinfo._id,
        msgcode:smgcode.toString(),
        used:"0",
        ctime:localctime,
        uptime:"",
      }
      return this.memberService.addMsgCode(saveData as CreateMsgDto);
  }
  //https://www.mdnice.com/writing/9ce53aab7f554fbb9225680eb099ee67 发送邮件

  @UseGuards(ResetpasswdGuard)
  @Post('/changewd')
  public async changePasswd(@Body() accountInfo:UpdateMemberDto){
    //修改密码      
       const password = CommonUtility.encryptBySalt(accountInfo.password);
       accountInfo.password = password;
       let updateMemberInfo = await this.memberService.updateMemberById(accountInfo);
       if(!updateMemberInfo) throw new ConflictException('更新数据错误');
       this.memberService.deleteMsgCode(accountInfo);
      return {message:"更新成功"};
  }
  

  @UseGuards(AuthGuard('jwt'))
  @Post('/profilechangewd')
  async changePw(@Req() request: Request) {
    const user = request.user as BaseMemberDto
    const {oldPw,newPw} =request.body  
   
    const meminfo = await this.memberService.findUser({ _id: user.id });
    const password2 = CommonUtility.encryptBySalt(oldPw,meminfo?.password?.salt);   
    if(password2.hash != meminfo.password.hash){
      throw new ConflictException('旧密码错误')    
    }
    let upData ={
      userId:user.id,
      password:password2
    }
    const others = await this.memberService.changeMemberDtoById(upData)
    return others;
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('freezeU')
  async freezeU(@Req() request: Request) {
    const user = request.user as BaseMemberDto
    const {count,freezeModel} = request.body
    const meminfo = await this.memberService.findUser({ _id: user.id });

    if(freezeModel && count > meminfo.usdt){
      throw new ConflictException('您的账户余额不足');
    }
    if(!freezeModel && count > meminfo.freezeBail){
      throw new ConflictException('您的账户冻结金额不足');
    }
    let uData = {
      id:user.id,
      count
    }
    if(freezeModel){
      return await this.memberService.freezeBailNum(uData)
    }else{
      return await  this.memberService.unfreezeBailNum(uData)
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/changeProfile')
  async changeProfile(@Req() request: Request) {
    const user = request.user as BaseMemberDto
    const {nickname,introduction,imageFiles} =request.body
    let uData = {
      userId:user.id,
      nickname,
      introduction,      
    }   
    if(imageFiles&&imageFiles.length>0){
      uData['avatar'] = imageFiles
    } 
    return await this.memberService.changeMemInfo(uData);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  signin(@Req() request: Request,@RealIP() ip: string) {
      this.memberService.updateLoginTimes(request.user as MemberDocument);
      this.memberService.updateLoginIps(request.user as MemberDocument,ip);
      return request.user;
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  async getUser(@Req() request: Request) {
    const user = request.user as BaseMemberDto
    const meminfo = await this.memberService.findUser({ _id: user.id });
    const { password, ...others } = meminfo.toJSON();
    let domain =await this.sysService.getConfig('shortDomain')
    let sysname =await this.sysService.getConfig('sysname')
    return {...others,domain,sysname};
  }


  /**个人中心部分数据 */

  @UseGuards(AuthGuard('jwt'))
  @Get('menuList')
  async getmenuList(@Req() request: Request) {

    const memlist = [
      {cname:"需求订单",inused:true,rightArrow:true,iconLabel:"icon-listview",chref:"needorder"},
      {cname:"安全设置",inused:true,rightArrow:true,iconLabel:"icon-Rrl_s_061",chref:"/safeset"},
      {cname:"交易保障",inused:true,rightArrow:true,iconLabel:"icon-lv_zuanshi_fill",chref:"/protection"},
      {cname:"账户验证",inused:true,rightArrow:true,iconLabel:"icon-yanzhengyanzhengma",chref:"/verifyaccunt"},   
      {cname:"账户设置",inused:true,rightArrow:true,iconLabel:"icon-zhanghushezhi",chref:"/setaccunt"}, 
      {cname:"我的收藏",inused:true,rightArrow:true,iconLabel:"icon-star1",chref:"/collect"},      
      {cname:"在线客服",inused:true,rightArrow:true,iconLabel:"icon-kefu1",chref:"/kefu"},      
      {cname:"退出登录",inused:true,rightArrow:true,iconLabel:"icon-tuichudenglu",chref:"/login"},


      {cname:"用户等级",inused:false,rightArrow:false,iconLabel:"icon-Rrl_s_061",unfinished:true,chref:"#",vlabel:"一级会员",  vclass:"label-inline step-btn-padding  label-light-secondary"},
      {cname:"推荐用户",inused:false,rightArrow:false,iconLabel:"icon-Rrl_s_061",unfinished:true,chref:"#",vlabel:"0人",vclass:"label-inline step-btn-padding  label-light-secondary"},
      {cname:"福利中心",inused:false,rightArrow:true,iconLabel:"icon-Rrl_s_061"},
      {cname:"易优支付",inused:false,rightArrow:false,iconLabel:"icon-Rrl_s_061",unfinished:true,chref:"#",vlabel:"未开通",   vclass:"label-inline step-btn-padding  label-light-secondary"},
      {cname:"通知设置",inused:false,rightArrow:true,iconLabel:"icon-Rrl_s_061"},
      {cname:"收款设置",inused:false,rightArrow:true,iconLabel:"icon-Rrl_s_061",chref:"/payment"},
      {cname:"回复设置",inused:false,rightArrow:true,iconLabel:"icon-Rrl_s_061"},
      {cname:"账户明细",inused:false,rightArrow:true,iconLabel:"icon-Rrl_s_061"},
      {cname:"登录日志",inused:false,rightArrow:true,iconLabel:"icon-Rrl_s_061"},
    ]

    return memlist;
    
  }
}
