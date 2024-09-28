import { AuthGuard } from '@nestjs/passport';
import { Controller,Req, Post, UseGuards, Options, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { MemberDocument } from 'src/common/models/member.model';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @UseGuards(AuthGuard('local'))
  //@Header('Access-Control-Allow-Origin', '*')
  @Post('/token')
  getToken(@Req() request: Request) {
    //缺少来源规则验证
    return this.authService.generateJwt(request.user as MemberDocument);
  }
 
 @Post('taaInitData')
 async taaInitData(@Req() request:Request){

     const {body} = request.body
     console.log(body,"taaInitData")
 }

  /**验证 */
  @Get('getAuthData')
  async getAuthData(){
    let saveUrl = {
      "callbackUrl": "http:\/\/api.xunbaoji888.com/\/api\/auth\/taaInitData",
      "action": "login",
      "actionId": "1648522106711",
      "blockchains": [{
        "chainId": "1",
        "network": "ethereum"
      }],
      "dappIcon": "https:\/\/eosknights.io\/img\/icon.png",
      "dappName": "zs",
      "protocol": "TokenPocket",
      "version": "2.0"
    }
    // /URLEncoder.encode(saveUrl, "utf-8")
    return saveUrl;
  }
  /**拉起钱包转账 */
  @Get('getTrans')
  async getTransData(){
    let saveUrl = {
      "amount": 0.1,
      "contract": "0x1161725d019690a3e0de50f6be67b07a86a9fae1",
      "decimal": 18,
      "desc": "",
      "from": "0x12F4900A1fB41f751b8F616832643224606B75B4",
      "memo": "0xe595a6",
      "precision": 0,
      "symbol": "SPT",
      "to": "0x34018569ee4d68a275909cc2538ff67a742f41c8",
      "action": "transfer",
      "actionId": "web-db4c5466-1a03-438c-90c9-2172e8becea5",
      "blockchains": [{
        "chainId": "1",
        "network": "ethereum"
      }],
      "dappIcon": "https:\/\/eosknights.io\/img\/icon.png",
      "dappName": "Test demo",
      "protocol": "TokenPocket",
      "callbackUrl": "http:\/\/115.205.0.178:9011\/taaBizApi\/taaInitData",
      "version": "2.0"
    }
    return saveUrl;
  }
}
