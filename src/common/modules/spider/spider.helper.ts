import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios-https-proxy-fix';
import httpsProxyAgent from 'https-proxy-agent';
import { SocksProxyAgent } from "socks-proxy-agent"

@Injectable()
export class SpiderService {
  
  private hashCheckUrl ="https://nileapi.tronscan.org/api/transaction-info?hash=";
  private walletChcekUrl = "https://nileapi.tronscan.org/api/account/token_asset_overview?address=";  

  private proxyConfig = {
    proxy: {
      protocol: 'http',
        host: '127.0.0.1',
        port: 8580
    }
  }
  async getCheckNet(netData:{payHash:string,walletAddress:string,netType:number}) {   
    let returnJson ={status:true,toAddress:"",fromAddress:"",amount:0,tokenType:"",symbol:"",msg:""}; 
    await axios.get(this.hashCheckUrl+netData.payHash,this.proxyConfig)
    .then(function (response) {  
      let data = response.data;
      if(data.tokenTransferInfo){
        returnJson.toAddress = data.tokenTransferInfo.to_address
        returnJson.fromAddress = data.tokenTransferInfo.from_address
        returnJson.amount = data.tokenTransferInfo.amount_str
        returnJson.tokenType = data.tokenTransferInfo.tokenType
        returnJson.symbol = data.tokenTransferInfo.symbol
      }else if(data.contractData){
        returnJson.toAddress = data.contractData.to_address
        returnJson.fromAddress = data.contractData.owner_address
        returnJson.amount = data.contractData.amount
        returnJson.tokenType = 'trc20'
        returnJson.symbol = 'TRX'
      }else{
        returnJson.status = false
      }
    })
    .catch(function (error) {
      returnJson.status = false
      returnJson.msg = error
      return error;
    })
    return returnJson;
  }

  async getWalletData(netData:{payHash:string,walletAddress:string,netType:number}) {   
    const contractreturnData = await axios.get(this.walletChcekUrl+netData.walletAddress,this.proxyConfig)
    .then(function (response) {  
      if(response.data.totalAssetInTrx) return response.data;
      else return {};
    })
    .catch(function (error) {
     return error;
    })   
    let {totalAssetInTrx,totalAssetInUsd,totalTokenCount} =contractreturnData
    let returnJson={status:true,totalAssetInTrx,totalAssetInUsd,totalTokenCount}
    if(JSON.stringify(contractreturnData) == "{}") returnJson.status = false
    return returnJson;
  }

}
