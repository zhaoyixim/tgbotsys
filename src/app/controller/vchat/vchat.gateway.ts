import { WebSocketGateway,WebSocketServer , SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayDisconnect, WsException } from '@nestjs/websockets';
import { VchatService } from './vchat.service';
import { CreateVchatDto, CreateVmessageDto } from './dto/create-vchat.dto';
import { UpdateVchatDto } from './dto/update-vchat.dto';
import { Server, Socket } from 'socket.io';
import { Req } from '@nestjs/common';
import { TransUser } from 'src/app/common/interface/trans.interface';
import { Request } from 'express';
import { MemberService } from '../member';

@WebSocketGateway(9892,{
  //transports: ['websocket'],
  cors: true
})

export class VchatGateway implements OnGatewayDisconnect{
  constructor(private readonly vchatService: VchatService,
    private readonly memberService: MemberService) {}
  _oneliners: Record<string, any> = {};

  handleDisconnect(client: Socket) {
    let removeKey = null;
    Object.keys(this._oneliners).map(key => {
      if (this._oneliners[key] === client) {
        removeKey = key;
      }
    });
    delete this._oneliners[removeKey];
   // this.memberService.findAndUnActive(removeKey)
    //console.log("断开连接",removeKey)
  }	

  @SubscribeMessage("offline")
  public async offline(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const {userId} = data;
   // delete this._oneliners[userId];
    //this.memberService.findAndUnActive(userId)
   // console.log("断开连接",userId)
  }
  @SubscribeMessage("online")
  public async online(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const {userId} = data;
    const user = await this.memberService.findAndActive(userId);
    if(!userId) { throw new WsException('用户未登录')};
    const findVchat = await this.vchatService.findClientInstanceByUserId(userId);
    const saveData:CreateVchatDto = {username:user.username,userId,clientId:client.id}
    let returnJson = {}
    if(!findVchat){
      returnJson = await this.vchatService.createClientInstance(saveData);
    }else{
      returnJson = await this.vchatService.updateClientInstanceByUserId(userId,saveData);
    }
    this._oneliners[userId] = client;
    console.log(`用户登录，userId: ${userId}`)
    //console.log(`在线用户: ${Object.keys(this._oneliners)}`)
    return { event: "online", returnJson };
  } 
  // 发送消息
  @SubscribeMessage("send")
  async send(@MessageBody() data: any) {
    const {userId,touserId,context,fromBidId,fromTradeId,ctype,contentBody} = data;
    const user = await this.memberService.findUser({ _id:userId });
    const toUser = await this.memberService.findUser({ _id:touserId });
    let sendData:any = {touserId:touserId,avatar:user.avatar,username:user.username,context:context,isActive:false}  

    /**保存消息 */
    let contentitem = ""
    if(ctype >1 &&  data.contentBody) contentitem = data.contentBody
    let saveMessage:CreateVmessageDto = {
      username:user.username,
      userId,
      touserId,
      fromBidId:fromBidId,
      fromTradeId,
      ctype,
      contentBody:contentitem,
      content:context
    }
    let messageItem =  await this.vchatService.createVmessageInstance(saveMessage)  
     sendData.contentBody = contentitem    
     if(this._oneliners[touserId]) this._oneliners[touserId].emit('send', sendData);     
    return { event: "send", sendData };
  }
  /**controller 使用触发动作 */
  public async forControllerSendMessage(messageId:string,touserId:string){
    let findMessage =await this.vchatService.findMessageById(messageId);
    let sendData:any = {touserId:findMessage.touserId,username:findMessage.username,context:findMessage.content,contentBody:findMessage.contentBody,ctype:findMessage.ctype,isActive:false}      
      if(findMessage.ctype == 2){
        sendData.context = '<img class="image-box" src='+sendData.contentBody+' />' ;
      }
      if(findMessage.ctype == 3){
        sendData.context = '<video style=\"width:120px;height:120px;object-fit:cover;\"  src=\"' +sendData.contentBody + '\"></video>';
      }
    this._oneliners[touserId].emit('send', sendData);
  }
  @SubscribeMessage("getMessageLists")
  async getMessageLists(@MessageBody() data: any) {
    const {userId,touserId,fromBidId,fromTradeId,pageSize,page} = data;
    let limits = {limit:pageSize,skip:pageSize * (parseInt(page) - 1)}  
    const doc = await this.vchatService.getMessageLists({userId,touserId,fromBidId,fromTradeId},limits,page)
    let returnJson = []  
    const toUser = await this.memberService.findUser({ _id:touserId });
    doc.documents.forEach(res=>{
      let contextTxt = res.content
      if(res.ctype == 2){
        contextTxt = '<img class="image-box" src='+res.contentBody+' />' ;
      }
      if(res.ctype == 3){
        contextTxt = '<video style=\"width:120px;height:120px;object-fit:cover;\"  src=\"' +res.contentBody + '\"></video>';
      }
      let dp = {
        username:res.username,
        context:contextTxt,
        ctype:res.ctype,
        isRead:res.isRead,
        ctime:res.ctime,
        touserId:res.touserId,        
        userId:res.userId,
        contentBody:res.contentBody,
        isActive:false,
        avatar:toUser.avatar
      }
      returnJson.push(dp)
    })   
    return {returnJson,current:doc.current};
  } 
}
