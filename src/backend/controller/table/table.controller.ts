import {Body, Controller,Post, Get, UseGuards,  ConflictException } from '@nestjs/common';
import { TableService } from './table.service';
import { AuthGuard } from '@nestjs/passport';
import { SpiderService } from 'src/common/modules/spider/spider.helper';
import { SysService } from '../sys/sys.service';
import { MemberService } from 'src/app/controller/member';

  @Controller('v1/table')
  export class TableController {
    constructor(
      private readonly tableService: TableService,
      private readonly spiderService: SpiderService,
      private readonly sysService:SysService,
      private readonly memberService:MemberService,
      
      ) {}
   
    @UseGuards(AuthGuard('jwt'))
    @Get('list')
    async getConsole(@Body() request:any){
      return {"code":200,"result":{"page":1,"pageSize":10,"pageCount":60,"list":[{"id":465911,"beginTime":"1995-08-04 15:28:15","endTime":"1984-01-15 20:04:40","address":"景德镇市","name":"冯杰","avatar":"http://dummyimage.com/400x400/798ff2/b2f279&text=Patricia","date":"2000-07-08","time":"16:33","no":5501127,"status":true},{"id":499003,"beginTime":"1970-08-11 10:09:21","endTime":"2019-09-26 16:19:55","address":"渭南市","name":"廖平","avatar":"http://dummyimage.com/400x400/f279d6/79f2eb&text=Betty","date":"1994-09-24","time":"13:14","no":9555107,"status":true},{"id":999972,"beginTime":"2014-11-26 09:26:11","endTime":"1981-12-29 06:36:15","address":"张家界市","name":"梁芳","avatar":"http://dummyimage.com/400x400/f2c779/a479f2&text=Ruth","date":"1992-01-24","time":"09:54","no":9343037,"status":true},{"id":541398,"beginTime":"2018-08-24 10:18:04","endTime":"1977-03-06 10:32:35","address":"巢湖市","name":"郑丽","avatar":"http://dummyimage.com/400x400/79f281/f27994&text=Margaret","date":"2015-12-16","time":"10:51","no":2321786,"status":false},{"id":769627,"beginTime":"1986-06-01 09:34:11","endTime":"1974-07-18 22:00:23","address":"遵义市","name":"冯秀英","avatar":"http://dummyimage.com/400x400/79b7f2/dbf279&text=Charles","date":"1994-10-22","time":"14:45","no":6019251,"status":true},{"id":169819,"beginTime":"1997-07-09 07:13:00","endTime":"2018-05-15 10:39:06","address":"新竹县","name":"曹娜","avatar":"http://dummyimage.com/400x400/e579f2/79f2c2&text=George","date":"2002-05-13","time":"16:27","no":9926733,"status":false},{"id":647781,"beginTime":"1984-01-07 14:52:37","endTime":"2011-12-25 12:45:18","address":"淮北市","name":"许勇","avatar":"http://dummyimage.com/400x400/f29f79/7b79f2&text=Karen","date":"1972-08-06","time":"07:55","no":5064661,"status":true},{"id":685335,"beginTime":"1971-06-13 17:03:16","endTime":"1971-07-18 01:08:38","address":"固原市","name":"雷敏","avatar":"http://dummyimage.com/400x400/99f279/f279bd&text=Karen","date":"1976-11-11","time":"19:57","no":5614426,"status":false},{"id":912214,"beginTime":"2012-04-07 06:26:52","endTime":"1986-02-21 14:01:25","address":"黄南藏族自治州","name":"林伟","avatar":"http://dummyimage.com/400x400/79e0f2/f2e079&text=Dorothy","date":"2007-12-20","time":"18:13","no":980874,"status":true},{"id":531230,"beginTime":"2007-02-19 20:31:16","endTime":"2020-02-14 05:03:47","address":"宝鸡市","name":"陈磊","avatar":"http://dummyimage.com/400x400/bd79f2/79f29a&text=Donald","date":"1989-03-13","time":"19:38","no":9953726,"status":false}]},"message":"ok","type":"success"};
    }

    /**网络验证充值 */
    @Post('netverify')
    async checkNetVerify(@Body() listinfo:any){     
      const netData = await this.tableService.findDepositById(listinfo.depositId);
      let {walletAddress,payHash,netType,userId,payedToAddress }=netData
      // let hashData = await this.tableService.findDepositHash(payHash);
      // if(JSON.stringify(hashData) != "{}" || hashData){
      //   throw new ConflictException('hash值已使用');
      //   return false;
      // }
      const findOrder = await this.tableService.findOrderByDepositId(listinfo.depositId)
      let defaultAddress = await this.sysService.getConfig("chargeAddress");
      if(netData.payedToAddress && (netData.payedToAddress != defaultAddress)){       
        throw new ConflictException('hash值对应的收款地址不匹配');
        return false;
      }
      if(netData.payedWalletAddress && (netData.payedWalletAddress != walletAddress)){
        throw new ConflictException('hash值对应的钱包地址与输入地址不匹配');
        return false;
      }
      let JosnData = await this.spiderService.getCheckNet({walletAddress,payHash,netType})
      if(JosnData.status){
        if(JosnData.toAddress &&(JosnData.toAddress != defaultAddress)){
          throw new ConflictException('hash值对应的收款地址不匹配');
          return false;
        }
        if(JosnData.fromAddress &&(JosnData.fromAddress != walletAddress)){
          throw new ConflictException('hash值对应的钱包地址与输入地址不匹配');
          return false;
        }
        const UId = userId as string;
        const orderId = findOrder._id as string
        await this.tableService.updateFromNetApi(listinfo.depositId,JosnData,netType,UId,orderId)
      }
      return JosnData;
    }

     /**获得用户充值钱包的余额 */
     @Post('walletverify')
     async checkWalletVerify(@Body() listinfo:any){
       const netData = await this.tableService.findDepositById(listinfo.depositId);
       let {walletAddress,payHash,netType }=netData       
       return await this.spiderService.getWalletData({walletAddress,payHash,netType});
     }

    /**
     * 充值数据 deposit
     */
    @Post('depositList')
    async getDeposit(@Body() listinfo:any){   
      let pageinfo = {
        limit:listinfo.pageSize,
        skip:listinfo.pageSize * (parseInt(listinfo.page) - 1)
      }  
      let userinfo = await this.tableService.getDepositTabelData(pageinfo);
      let returninfo = {
        "list":userinfo.data,
        "page":listinfo.page,
        "pageSize":listinfo.pageSize,
        "pageCount":Math.ceil(userinfo.count/listinfo.pageSize)
      }
      return {"result":returninfo}
    }

    /**修改充值数据变化 */
    @Post("depositEdit")
    async changeEdit(@Body() listinfo:any){
        const returnjson = await this.tableService.changeDeposit(listinfo)
        return {"result":{
          "message":"修改成功",
          "status":true
        }}
    }
    /**兑换部分 */ 
    //兑换数据 deposit     
    @Post('exchangeList')
    async getExchange(@Body() listinfo:any){   
      let pageinfo = {
        limit:listinfo.pageSize,
        skip:listinfo.pageSize * (parseInt(listinfo.page) - 1)
      }  
      let userinfo = await this.tableService.getExchangeTabelData(pageinfo);
      let returninfo = {
        "list":userinfo.data,
        "page":listinfo.page,
        "pageSize":listinfo.pageSize,
        "pageCount":Math.ceil(userinfo.count/listinfo.pageSize)
      }
      return {"result":returninfo}
    }
    /**修改兑换数据变化 */
    @Post("exchangeEdit")
    async exchangeEdit(@Body() listinfo:any){
        const returnjson = await this.tableService.changeExchange(listinfo)
        return {"result":{
          "message":"修改成功",
          "status":true
        }}
    }
    /**资产记录部分 */
    
    @Post('fundList')
    async getFundList(@Body() listinfo:any){   
      let pageinfo = {
        limit:listinfo.pageSize,
        skip:listinfo.pageSize * (parseInt(listinfo.page) - 1)
      }  
      let userinfo = await this.tableService.getFundTabelData(pageinfo);
      let returninfo = {
        "list":userinfo.data,
        "page":listinfo.page,
        "pageSize":listinfo.pageSize,
        "pageCount":Math.ceil(userinfo.count/listinfo.pageSize)
      }
      return {"result":returninfo}
    }
    

    /**
     * 订单部分
     */
    @Post('orderList')
    async getOrderList(@Body() listinfo:any){   
      let pageinfo = {
        limit:listinfo.pageSize,
        skip:listinfo.pageSize * (parseInt(listinfo.page) - 1)
      }  
      let userinfo = await this.tableService.getOrderTabelData(pageinfo);
      let returninfo = {
        "list":userinfo.data,
        "page":listinfo.page,
        "pageSize":listinfo.pageSize,
        "pageCount":Math.ceil(userinfo.count/listinfo.pageSize)
      }
      return {"result":returninfo}
    }

   /**
    * 提现部分
    */
   @Post('withdrawList')
   async getWithdrawList(@Body() listinfo:any){   
     let pageinfo = {
       limit:listinfo.pageSize,
       skip:listinfo.pageSize * (parseInt(listinfo.page) - 1)
     }  
     let userinfo = await this.tableService.getWithdrawTabelData(pageinfo);
     let returninfo = {
       "list":userinfo.data,
       "page":listinfo.page,
       "pageSize":listinfo.pageSize,
       "pageCount":Math.ceil(userinfo.count/listinfo.pageSize)
     }
     return {"result":returninfo}
   }
   @Post('sureWithDraw')
   async sureWithDraw(@Body() listinfo:any){   
     
     let withdrawData =await this.tableService.findWithdrawData(listinfo.withDrawId)
     let selectField = 'freezeUsdt usdtAll usdt freezeOutUsdt freezeUsdt unfinishednum'
     const meminfo = await this.memberService.findById(listinfo.userId,selectField)

     //校验部分
     if(meminfo.usdt<withdrawData.nums){
      throw new ConflictException('提现数据出错:提现'+withdrawData.nums+'账户余额'+meminfo.usdt)
     }
     if(withdrawData.netverify>= 1){
      throw new ConflictException('已经提现过了');
     }
     let pageinfo = {
      withDrawId:listinfo.withDrawId,
      userId:listinfo.userId,
      withNums:withdrawData.nums
    }  

     //
     console.log(meminfo,"meminfo",withdrawData)
     let returninfo = await this.tableService.sureWithDrawData(pageinfo);
    
     return returninfo;
   }

   


  }