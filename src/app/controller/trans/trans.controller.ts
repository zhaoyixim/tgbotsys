import {Body,Param, Controller,Req, Post,Get, UseGuards, ConflictException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransService } from './trans.service';
import { Request } from 'express';
import { TransUser } from 'src/app/common/interface/trans.interface';
import { SysService } from 'src/backend/controller/sys/sys.service';
import { OrderSts } from 'src/app/common/enums/order.enum';
import { MemberService } from '../member';
import { TransactionHelper } from 'src/common/modules/transaction/transaction.helper';
import { Connection, Model,Schema } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';       
import { UploadService } from 'src/common/modules/upload/upload.service';
/**创建充值提现订单 */

@Controller('trans')
  export class TransController {
    constructor(
      private readonly transService: TransService,
      private readonly sysService: SysService,
      private readonly memberService: MemberService,
      private readonly transactionHelper: TransactionHelper,
      private readonly uploadService:UploadService,
      @InjectConnection() private connection: Connection
      ) {}

    /**事务需要用到的model */
    private TransactionModel: Model<unknown>;
    /*充值 */
    @UseGuards(AuthGuard('jwt'))
    @Post('/charge')
    async getConsole(@Req() request: Request){
       let { body } = request;       
       let user  = request.user as TransUser;
       let checkedLabel = body.rechargenet;    
       const saveData = {
          userId:user.id,
          username:user.username,
          nums:body.rechargenum,
          netType:checkedLabel.labelvalue,
          netTypeLabel:checkedLabel.labelname.toLowerCase()
       }        
       /**资产记录 */
       const saveDeposit = {...saveData,freezeSts:"1",freezeNums:body.rechargenum,restAllNums:body.rechargenum}
       let newOrderData = await this.transService.createDeposit(saveDeposit);
       /**订单记录 */
       
       const saveOrder = {...saveData,depositId:newOrderData._id, orderTitle:"账户充币"+body.rechargenum + "USDT",orderSts:3,ctime:"",expireTime:""}
       let orderBill = await this.transService.createOrder(saveOrder)
       return {"result":{
            "message":"提交成功",
            "data":{"orderbill":orderBill},
            "status":true
          }};
     }
    /**chargeing 页面初始化数据 */
    @Get("chargeing/:id")
    async getChargeingData(@Param('id') orderId: string){
      let baseurl = "http://127.0.0.1:8000" ;
      let findConfig =await this.sysService.getConfig('sourceDomian')
      if(findConfig){
        baseurl = findConfig as string;
      }
      let hint = "请仔细选择您的充币网络，如数向订单对应地址转账 <b>泰达币USDT (Tether USD)</b>，随意转入其他任何币种 <b>概不受理损失自负</b>，如无法分辨确认，请勿使用！<b>充币订单地址为易优公用地址，仅在订单时效内匹配充值，请勿私用随意转入</b>，如未按规则流程使用，造成任何损失自负！ "
      const ReceiveQrcode = await this.uploadService.getReceiveQrcode();
      if(!ReceiveQrcode._id){
        throw new ConflictException('收款地址未上传')
      }      
      let qrcode = baseurl + ReceiveQrcode.photo
      let chargeAddress = await this.sysService.getConfig("chargeAddress"); 
      let findOrder = await this.transService.findOrderById(orderId);
      let depositData = await this.transService.findDepositById(findOrder.depositId)
      //let findTimeLimit = await this.sysService.getConfig("orderTimeLimit");
      /**
       * 查看是否超时
       */
      const findTime = new Date(findOrder.expireTime);
      let nowTime =new Date();
      const difftime = findTime.getTime() - nowTime.getTime();
     
      /*
      const leftDay = Math.floor(difftime/(24*3600*1000));
      const leftMiddelHours = difftime%(24*3600*1000);
      const leftHours = Math.floor(leftMiddelHours/(3600*1000));
      const leftMiddelMinutes = leftMiddelHours%(3600*1000);
      const leftMinutes = Math.floor(leftMiddelMinutes/(60*1000));
      const leftMiddelSecondNum = leftMiddelMinutes%(60*1000);
      const leftSecond = Math.floor(leftMiddelSecondNum/1000);
      console.log("difftime",leftDay,leftHours,leftMinutes,leftSecond)*/
      //计算相差秒数
      let returnjson= {
        hint,
        qrcode,       
        orderStsLabel:OrderSts[findOrder.orderSts],       
        leftTimeSeconds:difftime
      }
      return {"result":{         
          "data":{...returnjson,...findOrder,depositData, address:chargeAddress},
          "status":true
        }};
    }
     
    /**
     * 取消订单
     */
    @Get("cancel/:id")
    async cancelOrder(@Param('id') orderId: string){
      let findOrder = await this.transService.findOrderById(orderId);
      let expireTime = new Date(findOrder.expireTime).getTime() - new Date().getTime();
      //let expireTimeLimit = new Date(findOrder.expireTime).getTime() - new Date(findOrder.ctime).getTime();
      
      let message = "该订单已经"+OrderSts[findOrder.orderSts];
      console.log(expireTime);
      
      if(expireTime  <= 0 && findOrder.orderSts < 4) message= await this.transService.expireOrderBill(orderId);
      else if(findOrder.orderSts == 3) message= await this.transService.cancelOrderBill(orderId); 
    
     
      if(findOrder.orderSts == 2) message = "订单等待验证中，无法取消";
      return {"result":{         
          "data":{message},
          "status":true
        }};    
    }
    /**
     * 订单验证
     */   
     @Post("confirm")
     async confirmOrder(@Req() request: Request){
      let { body } = request;      
      let orderId = body.orderId
      let {walletAddress,payHash } =body
      let findOrder = await this.transService.findOrderById(orderId);
      let returnJson = {data:{},message:"",conSts:false}
      returnJson.message = "该订单已经创建，请进行"+OrderSts[findOrder.orderSts];    
      let hashData = await this.transService.findDataByHash(payHash);
      if(JSON.stringify(hashData) != "{}" || hashData){
        throw new ConflictException('hash值已使用');
        return false;
      }      
      if(findOrder.orderSts ==3){
        returnJson.conSts = true
        returnJson.message = ""
        returnJson.data = await this.transService.confirmOrderBill(orderId,findOrder.depositId,{walletAddress,payHash });
      } 
      return { "result":{         
          "data":returnJson,
          "status":true
        }};      
     }

     @Get('defaultLimitUsdt')
     async getDefaultLimitUsdt(){
       let returnJson = this.sysService.getConfig("leastUsdtSetting")
       return returnJson;
     }
    /**网络验证 */
     @Post('verifyNet')
     async verifyFromNet(@Req() request: Request){
      let { body } = request;      
      let orderId = body.orderId
      let findOrder = await this.transService.findOrderById(orderId);     
      return findOrder;
     }
    /*交换 --换汇 trx*/

    /*换汇充值 */
    @UseGuards(AuthGuard('jwt'))
    @Post('/trxexchange')
    async trxchargeConsole(@Req() request: Request){    
      let { body } = request; 
      let user  = request.user as TransUser;
      const userinfo = await this.memberService.findUser({_id:user.id})
      //查看提现金额够不够       
      if(userinfo.usdt < body.trxexchangenum) {
       //提现资产不够
       return {          
         "result":{
           "message":"账户余额不足此次交换",           
           "status":true
         },          
       };
      }
      const saveData = {
       userId:user.id,
       username:user.username,
       address:'系统钱包地址',
       nums:body.trxexchangenum,
       netType:"1",
       netTypeLabel:'TRC20'
      } 
      //交换记录数据
      const saveExchange = {...saveData,restNums:userinfo.usdt - body.trxexchangenum,restAllNums:userinfo.usdtAll}
       //订单记录数据
      const saveOrder = {...saveData,paytype:2,orderTitle:"兑换"+body.trxexchangenum + "USDT",orderSts:21,ctime:"",expireTime:""}
       /*事务部分开始*/
      if(this.TransactionModel == null) {
       this.TransactionModel = this.connection.model('transactionExchangeTest', new Schema({ name: String, createTime: Number }));
      }
      //开启事务
      const session = await this.transactionHelper.startTransaction();
      let orderBill= null;
      // 逻辑处理
      try{
       //提现记录 处理
       await this.transService.createExchange(saveExchange);
       //更改用户资产 处理
       await this.transService.updateMemberFunds({...request.user,...saveData,plus:false});
       //订单记录 处理
       orderBill = await this.transService.createOrder(saveOrder);
       if(orderBill){
         //提交事务
         await this.transactionHelper.commitTransaction(session);
       }
      } catch(err) {
       console.log(err)
       //回滚事务
        await this.transactionHelper.rollbackTransaction(session);
      } finally {
         if(orderBill) {
           return {"result":{"message":"提交成功","data":{"orderbill":orderBill},"status":true}};
         }
      } 
      return {"result":{"data":{"orderbill":orderBill},"message":"提交成功","status":true}};
     }


    /**
     * 取消兑换
     */
    @UseGuards(AuthGuard('jwt'))
    @Get("exchangecancel/:id")
    async cancelExchangeOrder(@Req() request: Request,@Param('id') orderId: string){
      let findOrder = await this.transService.findOrderById(orderId);
      let user  = request.user as TransUser;
      const userinfo = await this.memberService.findUser({_id:user.id})
      let message = "该订单已"+OrderSts[findOrder.orderSts];
      if(findOrder.orderSts != 21)  return {"result":{"data":{message},"status":true}};
      
      const saveData = {
        userId:findOrder.userId as string,
        username:findOrder.username,
        netType:findOrder.netType,
        nums:findOrder.nums,
        address:findOrder.address,
        netTypeLabel:findOrder.netTypeLabel
       }       
      //交换记录数据  归还资产
      const saveExchange = {...saveData,plus:1,restNums:userinfo.usdt +saveData.nums,restAllNums:userinfo.usdtAll}
       /*事务部分开始*/
       if(this.TransactionModel == null) {
        this.TransactionModel = this.connection.model('transactionExchangeTest', new Schema({ name: String, createTime: Number }));
       }
       //开启事务
       const session = await this.transactionHelper.startTransaction();
       let orderBill= null;
       // 逻辑处理
       try{
        //行为记录 处理
        //提现记录 处理
        await this.transService.createExchange(saveExchange);
        //更改用户资产 处理
        await this.transService.updateMemberFunds({...request.user,...saveData,plus:true});
        message= await this.transService.cancelExchangeOrderBill(orderId);        
        //提交事务
        await this.transactionHelper.commitTransaction(session);
        
       } catch(err) {
        console.log(err)
        //回滚事务
         await this.transactionHelper.rollbackTransaction(session);
       } 
      return {"result":{"data":{message},"status":true}};
    }


    /*提现 */  

    @UseGuards(AuthGuard('jwt'))
    @Post('/withdraw')
    async withdrawConsole(@Req() request: Request){
       let { body } = request; 
       let user  = request.user as TransUser;
       const userinfo = await this.memberService.findUser({_id:user.id})
       //查看提现金额够不够       
       if(userinfo.usdt < body.withdrawnum) {
        //提现资产不够
        return {          
          "result":{
            "message":"账户余额不足此次提现",           
            "status":true
          },          
        };
       }
       const saveData = {
        userId:user.id,
        username:user.username,
        address:body.withdrawaddress,
        nums:body.withdrawnum,
        netType:body.withdrawnet.labelvalue,
        netTypeLabel:body.withdrawnet.labelname
       } 
       //提现记录数据
       const saveWithdraw = {...saveData,restNums:userinfo.usdt - body.withdrawnum,restAllNums:userinfo.usdtAll}
        //订单记录数据
       const saveOrder = {...saveData,paytype:1,orderTitle:"账户提币"+body.withdrawnum + "USDT",orderSts:11,ctime:"",expireTime:""}
        /*事务部分开始*/
       if(this.TransactionModel == null) {
        this.TransactionModel = this.connection.model('transactionTest', new Schema({ name: String, createTime: Number }));
       }
       //开启事务
       const session = await this.transactionHelper.startTransaction();
       let orderBill= null;
       // 逻辑处理
       try{
        //提现记录 处理

        orderBill = await this.transService.createOrder(saveOrder);        
        if(orderBill._id){
          let transsaveWithdraw = {...saveWithdraw,orderId:orderBill._id}
          //更改用户资产 处理
          //await this.transService.updateMemberFunds({...request.user,...saveData});
          //订单记录 处理
          let withdrawData =  await this.transService.createWithdraw(transsaveWithdraw);         
          if(withdrawData){
            //提交事务
            await this.transactionHelper.commitTransaction(session);
          }
        }else{
          await this.transactionHelper.rollbackTransaction(session);
        }
       
       } catch(err) {
        console.log(err)
        //回滚事务
         await this.transactionHelper.rollbackTransaction(session);
       } finally {
          if(orderBill) {
            return {"result":{"message":"提交成功","data":{"orderbill":orderBill},"status":true}};
          }
       } 
       return {"result":{"message":"提交成功","status":true}};
     }
       
    /**
     * 取消提现
     */
    @UseGuards(AuthGuard('jwt'))
    @Get("withdrawcancel/:id")
    async cancelWithdrawOrder(@Req() request: Request,@Param('id') orderId: string){
      let findOrder = await this.transService.findOrderById(orderId);
      let user  = request.user as TransUser;
      const userinfo = await this.memberService.findUser({_id:user.id})
      let message = "该订单已"+OrderSts[findOrder.orderSts];
      if(findOrder.orderSts != 11)  return {"result":{"data":{message},"status":true}};
      const saveData = {
        userId:findOrder.userId as string,
        username:findOrder.username,
        netType:findOrder.netType,
        nums:findOrder.nums,
        address:findOrder.address,
        netTypeLabel:findOrder.netTypeLabel
       }       
        //行为记录数据
        //提现记录数据  归还资产
        const saveWithdraw = {...saveData,plus:1,restNums:userinfo.usdt +saveData.nums,restAllNums:userinfo.usdtAll}
      /*事务部分开始*/
      if(this.TransactionModel == null) {
        this.TransactionModel = this.connection.model('transactionTest', new Schema({ name: String, createTime: Number }));
       }
       //开启事务
       const session = await this.transactionHelper.startTransaction();
       let orderBill= null;
       // 逻辑处理
       try{
        //提现记录 处理
        await this.transService.createWithdraw(saveWithdraw);
        //更改用户资产 处理
        await this.transService.updateMemberFunds({...request.user,...saveData,plus:true});
        message= await this.transService.cancelOrderBill(orderId);        
        //提交事务
        await this.transactionHelper.commitTransaction(session);
        
       } catch(err) {
        console.log(err)
        //回滚事务
         await this.transactionHelper.rollbackTransaction(session);
       } 
      return {"result":{"data":{message},"status":true}};
    }
  }