import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { CommonUtility } from 'src/utils/common.utility';
import { SearchDto } from './dto/search.dto';

import { USER_MODEL_TOKEN, UserDocument } from '../../common/models/user.model';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../../../common/interface/payload.interface';
import { MemberDocument, MEMBER_MODEL_TOKEN } from 'src/common/models/member.model';
import { Ip_MODEL_TOKEN,IpDocument } from 'src/common/models/ip.model';
import { SysService } from '../sys/sys.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    @InjectModel(MEMBER_MODEL_TOKEN) private readonly memberModel:Model<MemberDocument>,
    @InjectModel(Ip_MODEL_TOKEN) private readonly ipModel:Model<IpDocument>,
    private readonly sysService: SysService,
  ) {}
  /* membermodel 部分 */  

  public async editMember(userData:any){
    return await this.memberModel.findByIdAndUpdate(
      userData.userId,
      {$set: {[userData.ckey]: userData.cvalue}}     
    )
  }

  /*列表查找 */
  public async findMembers(search: SearchDto, select?: any) { 
    const { skip, limit } = search;
    const query = this.memberModel.find().select(select);
    const documents = await query.skip(skip).limit(limit).exec();     
    const count = await this.memberModel.estimatedDocumentCount().exec();
    let returnjson = {
      "data":documents.map((document) => document?.toJSON()),
      "count":count
    } 
    return returnjson;
  }
  /*黑名单操作*/  
  public async setBlackList(setinfo:any){
    let inblacklist = false
    if(setinfo.enable == 'disabled') inblacklist = true;
    let updateinfoback = await this.memberModel.findByIdAndUpdate(setinfo.userId, {"inblacklist":inblacklist}, { new: true });
    /**是否开启批量杀死ip */
   
    let ipkillconfig = await this.sysService.getConfig('ipkillflag');
    let ipkillflag = ipkillconfig=="true"?true:false;
    if(ipkillflag){
      let document = await this.memberModel.findById(setinfo.userId).select("ips");
      let ips = document?.toJSON().ips;
      let ipsarr = ips.split(",");

      let timedata = new Date();
      let localctime = timedata.toLocaleString();
      
      if(ipsarr.length>0 && inblacklist){
        //加入黑名单
        let saveipsarr = []
        ipsarr.forEach(it=>{
          let savaip = {
            ip:it,       
            emituserId:setinfo.userId,
            ctime:localctime,
            uptime:localctime,
            blockSts:inblacklist,
            unblockTime:"",         
            emittimes:"1"
          }
          saveipsarr.push(savaip)
        })
        const ipdocument = await this.ipModel.collection.insertMany(saveipsarr);        
      }else if(ipsarr.length>0 && !inblacklist){
        //从黑名单解锁
        ipsarr.forEach(async (it) =>{
          await this.ipModel.findOneAndUpdate({
            emituserId:setinfo.userId,
            ip:it
          } , {"inblacklist":inblacklist,uptime:localctime,blockSts:false,unblockTime:localctime}, { new: true });
        })

      }
    }
    return true;
  }  

  /*usermodel 部分 */
  public async createUser(user: CreateUserDto) {
    const { username } = user;
    const password = CommonUtility.encryptBySalt(user.password);
    const document = await this.userModel.create({
      username,
      password
    });
    return document?.toJSON();
  }

  public async findUser(filter: FilterQuery<UserDocument>, select?: any) {
    const query = this.userModel.findOne(filter).select(select);
    const document = await query.exec();
    return document?.toJSON();
  }

  public async findUsers(search: SearchDto, select?: any) { 
    const { skip, limit } = search;
    const query = this.userModel.find().select(select);
    const documents = await query.skip(skip).limit(limit).exec();   
    return documents.map((document) => document?.toJSON());
  }

  public async deleteUser(userId: string) {
    const document = await this.userModel.findByIdAndRemove(userId).exec();
    if (!document) {
      return;
    }
    return {};
  }

  public async updateUser(userId: string, data: UpdateUserDto, select?: any) {
    const obj: Record<string, any> = { ...data };
    if (obj.password) {
      obj.password = CommonUtility.encryptBySalt(obj.password);
    }
    const query = this.userModel
      .findByIdAndUpdate(userId, obj, { new: true })
      .select(select);
    const document = await query.exec();
    return document?.toJSON();
  }

  public existUser(filter: FilterQuery<UserDocument>) {
    return this.userModel.exists(filter);
  }

  public async hasUser() {
    const count = await this.userModel.estimatedDocumentCount().exec();
    return count > 0;
  }

  /*获取token 放在这里 */

  public generateJwt(payload: UserPayload) {
    return {
      token: this.jwtService.sign(payload),
    };
  }

}