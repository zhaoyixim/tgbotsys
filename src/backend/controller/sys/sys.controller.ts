import {Body, Controller, Post, UseGuards,Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SysService } from './sys.service';
import { Request } from 'express';

@Controller('v1/sys')
export class SysController {
  constructor(private readonly sysService: SysService) {}     
  /**后台上传图片 */

  @Post('updateconfig')
  async updateConfig(@Req() request:Request){
     const {body} = request
     
     const returnJson = await this.sysService.updateValueConfig(body)
     console.log(body,"body")
     return returnJson;
  }
  @Post('getwebconfig')
  async getConfig(@Body() listinfo:any){    
    let pageinfo = {
      limit:listinfo.pageSize,
      skip:listinfo.pageSize * (parseInt(listinfo.page) - 1)
    }  
    let userinfo = await this.sysService.getAllconfig(pageinfo);
    let returninfo = {
      "list":userinfo.data,
      "page":listinfo.page,
      "pageSize":listinfo.pageSize,
      "pageCount":Math.ceil(userinfo.count/listinfo.pageSize)
    }

    return {
      "code":200,
      "result":returninfo,
      "message":"ok",
      "type":"success"
    };
  }   

  @Post('addwebconfig')
  async addConfig(@Body() request:any){  
    return {
      "code":200,
      "result":await this.sysService.createConfig(request),
      "message":"ok",
      "type":"success"
    };
  } 

  @Post('updatewebconfig')
  async updateWebConfig(@Body() request:any){      
    let returnjson = await this.sysService.updateConfig(request) ? true:false;
    return {
      "code":200,
      "result":returnjson,
      "message":"ok",
      "type":"success"
    };
  } 
  
  /*删除*/
  @Post('deletewebconfig')
  async deleteWebConfig(@Body() request:any){     
    if(!request.delete) return {
      "code":401,
      "result":{"message":"操作失败"},
      "message":"ok",
      "type":"success"
    };

    let returnjson = await this.sysService.deleteConfig(request) ? true:false;
     
    return {
      "code":200,
      "result":returnjson,
      "message":"ok",
      "type":"success"
    };
  } 

  /**清空配置 */
  
  @Post('clearWebconfig')
  async clearWebconfig() {
    return  await this.sysService.clearData()
  }
  /*初始化配置*/
  @Post('initwebconfig')
  async initwebconfig(){     
    // let pageinfo = {
    //   limit:10,
    //   skip:0
    // }  
    //let returnjson = await this.sysService.getAllconfig(pageinfo);    
   
    let initdata =[
      {
        cname: 'ip禁用配置项',
        ckey: 'ipkillflag',
        cvalue: 'true',
        desp: '开启该功能，则将用户拉入黑名单后，对应的该用户所有登录的ip都不能登录',
        cenable: true,
        cdelete: false,
        ctime: '2023/3/13 00:11:47'
      },
      {
        cname: '订单超时设置',
        ckey: 'orderTimeLimit',
        cvalue: '40',
        desp: '订单超时30分钟',
        cenable: true,
        cdelete: true,
        ctime: '2023/3/16 10:39:10'
      },
      {
        cname: '充值地址',
        ckey: 'chargeAddress',
        cvalue: 'TUe53VJrJqp9fWgRTGaPUtwanw1ZfnM2qM',
        desp: '用户充值地址设置',
        cenable: true,
        cdelete: true,
        ctime: '2023/3/22 10:33:37'
      },
      {
        cname: '默认usdt兑rmb价格',
        ckey: 'unitprice',
        cvalue: '6.56',
        desp: '默认1usdt兑的rmb价格',
        cenable: true,
        cdelete: false,
        ctime: '2023/5/1 18:19:14'
      },
      {
        cname: '创建出价需要最低账户金额',
        ckey: 'bidDefaultUsdt',
        cvalue: '500',
        desp: '创建出价需要最低账户金额,无论购买活着出售都需要账户默认的金额数量',
        cenable: true,
        cdelete: false,
        ctime: '2023/5/5 15:10:57'
      },
      {
        cname: '最低需求出价额度',
        ckey: 'leastUsdtSetting',
        cvalue: '500',
        desp: '默认最低u额度，才能创建出价',
        cenable: true,
        cdelete: false,
        ctime: '2023/5/10 22:00:06'
      },
      {        
        cname:"静态资源域名",
        ckey:"sourceDomian",
        cvalue:"http://api.xunbaoji888.com",
        desp:"前后台图片使用域名",
        cenable:true,
        cdelete:false,
        ctime:"2023/5/17 10:15:16",
      },
      {        
        cname:"系统名称",
        ckey:"sysname",
        cvalue:"海鸥Obay",
        desp:"系统名称",
        cenable:true,
        cdelete:false,
        ctime:"2023/5/17 10:15:16",
      },
      {        
        cname:"系统域名简称",
        ckey:"shortDomain",
        cvalue:"www.google.com",
        desp:"系统域名简称",
        cenable:true,
        cdelete:false,
        ctime:"2023/5/17 10:15:16",
      }
    ]
    
    await this.sysService.initManyInsert(initdata)
    // let initdata = []
    // returnjson.data.forEach((res,index)=>{  
    //   let p = res
    //   delete p._id       
    //   initdata.push(p)
    // })
    // console.log(initdata,"initdata")
    return {
      "code":200,
      "result":"",
      "message":"ok",
      "type":"success"
    };
  } 





}