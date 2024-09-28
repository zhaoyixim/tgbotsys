import {Body,Param, Controller,Req, Post,Get, UseGuards, ConflictException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MemberService } from '../member';
import { VchatService } from './vchat.service';
import { CreateVmessageDto } from './dto/create-vchat.dto';
import { VchatGateway } from './vchat.gateway';

@Controller('vchat')
export class VchatController{ 
  constructor(private readonly vchatService: VchatService,
    private readonly memberService: MemberService,
    private readonly webSoketWay:VchatGateway
    ) {} 
  @Post('uploadvideo')
  async uploadVideo(@Body() reqData:any){
    //只有在上传视频时候使用
    const {userId,touserId,context,fromBidId,fromTradeId,ctype,contentBody} = reqData;
    console.log({userId,touserId,context,fromBidId,fromTradeId})
    const user = await this.memberService.findUser({ _id:userId });
    const toUser = await this.memberService.findUser({ _id:touserId });
    let saveMessage:CreateVmessageDto = {
      username:user.username,
      userId,
      touserId,
      fromBidId:fromBidId,
      fromTradeId,
      ctype,
      contentBody,
      content:context
    }
    let messageItem =  await this.vchatService.createVmessageInstance(saveMessage)
    await this.webSoketWay.forControllerSendMessage(messageItem._id,touserId);
    let sendData:any = {touserId:touserId,username:user.username,context:context,isActive:false}
    sendData.context = '<video style=\"width:120px;height:120px;object-fit:cover;\"  src=\"' +contentBody + '\"></video>';
   
    return sendData;
  }

  @Post('getMessageList')
  async getMessageList(@Body() reqData:any){
    let {userId} = reqData
    return await this.vchatService.getMessageGroupByTradeId(userId);
  }
}
