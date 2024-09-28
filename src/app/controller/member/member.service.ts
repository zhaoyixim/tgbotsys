import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMemberDto, CreateMsgDto } from './dto/create-member.dto';
import { Member, MemberDocument, MEMBER_MODEL_TOKEN } from '../../../common/models/member.model';
import { CommonUtility } from './../../../utils/common.utility';
import { MSG_MODEL_TOKEN ,MsgDocument } from '../../../common/models/msg.model';
import { UpdateMemberChangeDto, UpdateMemberDto } from './dto/update-member.dto';

let timedata = new Date();
let localctime = timedata.toLocaleString();

@Injectable()
export class MemberService {
  constructor( 
  @InjectModel(MEMBER_MODEL_TOKEN) private readonly memberModel:Model<MemberDocument>,
  @InjectModel(MSG_MODEL_TOKEN) private readonly msgModel:Model<MsgDocument>
  ){}

  public async setDefaultAvatar(userId:string){
    let defaultAvatar = '/assets/avatar.jpg'
    return await this.memberModel.findByIdAndUpdate(
      userId,
      {avatar:defaultAvatar}
    )
  }


  public async createMember(member: CreateMemberDto,ip:string) {
    const { username, email } = member;
    const password = CommonUtility.encryptBySalt(member.password);
    const document = await this.memberModel.create({
      username,
      password,
      email,
      ctime:localctime,
      logintime:"",      
      uptime:"",
      ips:ip
    });
    return document?.toJSON();
  }
//find by id
 public async findById(id:string,select:any){
   const doc = await  this.memberModel.findById(id).select(select);
   return doc;
 }

 /**  更新 用户 在线状态 */
 public async findAndActive(userId:string){
  return await this.memberModel.findByIdAndUpdate(userId,{active:true},{new:true})
 }
 /**更新用户下线状态 */
 public async findAndUnActive(userId:string){
  return await this.memberModel.findByIdAndUpdate(userId,{active:false},{new:true})
 }
 /**冻结和解冻 */
  public async freezeBailNum(meminfo:any){
    return await this.memberModel.findByIdAndUpdate(
      meminfo.id,
      {$inc: {freezeBail: + meminfo.count,usdt: - meminfo.count},uptime:localctime},
    ) 
  }

  public async unfreezeBailNum(meminfo:any){
    return await this.memberModel.findByIdAndUpdate(
      meminfo.id,
      {$inc: {freezeBail: - meminfo.count,usdt: + meminfo.count},uptime:localctime},
    ) 
  }

  public async findUser(filter: FilterQuery<MemberDocument>) {
    return this.memberModel.findOne(filter).exec();
  }


  async findByOtherKey(filter:FilterQuery<MemberDocument>):Promise<MemberDocument>{
    return  this.memberModel.findOne(filter).exec();
  }

  /*更新登录数据 */
  public async updateLoginTimes(member:MemberDocument){
    return this.memberModel.findByIdAndUpdate(member._id,{logintimes:+1,logintime:localctime})
  }

  /*更新登录ip */
  public async updateLoginIps(member:MemberDocument,ip:string){
    let document =await this.memberModel.findById(member._id).select("ips");
    let ips = document?.toJSON().ips;    
    if(ips.indexOf(ip) < 0) {
      await this.memberModel.findByIdAndUpdate(member._id,{ips:ips+","+ip}); 
    } 
    return true;  
  }

  
  /*修改密码*/
  public async updateMemberById(member:UpdateMemberDto){ 
    let returninfo =  await this.memberModel.findByIdAndUpdate(member._id,{password:member.password,uptime:localctime});   
    return returninfo;
  }

  /*修改密码*/
  public async changeMemberDtoById(member:UpdateMemberChangeDto){ 
    let returninfo =  await this.memberModel.findByIdAndUpdate(member.userId,{password:member.password,uptime:localctime});   
    return returninfo;
  }

  /*修改用户资料 */
  public async changeMemInfo(member:any){
    let returninfo = "" 
    if(member.avatar){
       returninfo =  await this.memberModel.findByIdAndUpdate(
        member.userId,
        {nickname:member.nickname,
          introduction:member.introduction,
          avatar:member.avatar,
          uptime:localctime});
    }else{
       returninfo =  await this.memberModel.findByIdAndUpdate(
        member.userId,
        {nickname:member.nickname,
          introduction:member.introduction,
          uptime:localctime});
    }
    return returninfo;
  }

  /*添加验证码数据*/
  public async addMsgCode(msgData:CreateMsgDto){
    const document = await this.msgModel.create(msgData)
    return true;
  }

 //查找验证码

 public async findMsgCode(userId:string,msgcode:string) {
   const document = await this.msgModel.findOne({userId,msgcode,used:"0"}).exec();
   return document?.toJSON();
 }
 
 //销毁验证码
  public async deleteMsgCode(msg:UpdateMemberDto){
    const deletedata = await this.msgModel.findByIdAndUpdate(msg.msgid,{uptime:localctime,used:"1"});
    return deletedata;
  }
  
  /*增加未完成数据unfinishednum*/
 
  public async IncresementUnfinishNum(UserOrToUserId:string){
	await this.memberModel.findByIdAndUpdate(UserOrToUserId,{unfinishednum:+1},{new:true})	 
  }
  
  /*减少未完成数据unfinishednum*/
   
  public async DecresementUnfinishNum(UserOrToUserId:string){
  	await this.memberModel.findByIdAndUpdate(UserOrToUserId,{unfinishednum:-1},{new:true})	 
  }
  /**买-初入 */
  public async sellFunc(updateInfo:any){
    const sellData = await this.memberModel.findByIdAndUpdate(
        updateInfo.touserId,{$inc: {freezeUsdt: - updateInfo.usdtNums,unfinishednum:+1},
		uptime:localctime}); 
      
    const sellUsdtData = await this.memberModel.findByIdAndUpdate(
        updateInfo.userId,  
		{$inc: {freezeUsdt: + updateInfo.usdtNums,unfinishednum:+1},uptime:localctime}); 

    return {sellData,sellUsdtData}
  }
  /**买-退回*/
  public async sellFuncBack(updateInfo:any){
	const sellData = await this.memberModel.findByIdAndUpdate(
	    updateInfo.touserId, {$inc: {freezeUsdt: + updateInfo.usdtNums,unfinishednum: - 1},uptime:localctime}); 
	  
	const sellUsdtData = await this.memberModel.findByIdAndUpdate(
	    updateInfo.userId,{$inc: {freezeUsdt: - updateInfo.usdtNums,unfinishednum: - 1},uptime:localctime}); 
	
	return {sellData,sellUsdtData}
	
 }
  /**买-完成 */
  public async sellFuncSureOver(updateInfo:any){
    const sellData = await this.memberModel.findByIdAndUpdate(
        updateInfo.touserId, {$inc: {unfinishednum: - 1},uptime:localctime}); 
      
    const sellUsdtData = await this.memberModel.findByIdAndUpdate(
        updateInfo.userId,   {$inc: {
          freezeUsdt: - updateInfo.usdtNums,
          usdt: + updateInfo.usdtNums,
		  usdtAll: + updateInfo.usdtNums,
          unfinishednum: - 1},uptime:localctime}); 

    return {sellData,sellUsdtData}
  }
  /**卖 -初入*/
  public async sellOutFunc(updateInfo:any){
    return await this.memberModel.findByIdAndUpdate(
      updateInfo.userId,
	  {$inc: {usdt: - updateInfo.usdtNums,
	  freezeOutUsdt: + updateInfo.usdtNums,
	  unfinishednum: + 1},
	  uptime:localctime}); 
  }
  /**卖 -退回*/
  public async sellOutFuncBack(updateInfo:any){
    return await this.memberModel.findByIdAndUpdate(
      updateInfo.userId,{$inc: {usdt: + updateInfo.usdtNums,freezeOutUsdt: - updateInfo.usdtNums,unfinishednum: - 1},uptime:localctime}); 
  }
  
  /**卖 -完成*/
  public async sellOutFuncSureOver(updateInfo:any){
    const sellDataOut = await this.memberModel.findByIdAndUpdate(
      updateInfo.userId, {$inc: {freezeOutUsdt: - updateInfo.usdtNums,unfinishednum: - 1},uptime:localctime}); 
    const sellUsdtOutData = await this.memberModel.findByIdAndUpdate(
      updateInfo.touserId, {$inc: {usdt:+ updateInfo.usdtNums,unfinishednum: - 1},uptime:localctime});
    return sellUsdtOutData;
  }
  /**冻结数据-创建出价的时候冻结Usdt */
  public async freezeUsdt(updateInfo:any){
    return await this.memberModel.findByIdAndUpdate(
	updateInfo.userId,
	{$inc: {usdt: - updateInfo.nums,
	freezeUsdt: + updateInfo.nums},uptime:localctime});
  }

  /**解冻数据 */
  public async unfreezeUsdt(updateInfo:any){
    return await this.memberModel.findByIdAndUpdate(updateInfo.userId,{$inc: {usdt: + updateInfo.nums,freezeUsdt: - updateInfo.nums},uptime:localctime});
  }
   /**更新用户资产数据 */
   public async updateUsdtFundings(updateInfo:any){
      if(updateInfo.plus) 
        return await this.memberModel.findByIdAndUpdate(updateInfo.userId,{$inc: {usdt: + updateInfo.nums},uptime:localctime});
      else
        return await this.memberModel.findByIdAndUpdate(updateInfo.userId,{$inc: {usdt: - updateInfo.nums},uptime:localctime});
   }
   /**更新用户资产--后台操作 */
 //plus true 加
   public async updateDeposits(userId:string,amount:number,symbol:string,plus:true){
      if(plus){       
        if(symbol == 'TRX'){
          return await this.memberModel.findByIdAndUpdate(userId,{$inc:{trx: + amount,trxAll: + amount},uptime:localctime})
        }
        if(symbol == 'USDT'){
          return await this.memberModel.findByIdAndUpdate(userId,{$inc:{usdt: + amount,usdtAll: + amount},uptime:localctime})
        }
        
      }
   }

   /**后台操作提现 */

   public async withdrawDataUsdt(data:any){
      return await this.memberModel.findByIdAndUpdate(data.userId,
        {$inc:{usdt:  - data.withNums}})
   }
}
