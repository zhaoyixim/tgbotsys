import { Controller, Get, Post, Body, Patch, Param, Delete ,UseGuards, Req} from '@nestjs/common';
import { IndexService } from './index.service';
import { CreateIndexDto } from './dto/create-index.dto';
import { UpdateIndexDto } from './dto/update-index.dto';
import { AuthGuard } from '@nestjs/passport';
import { BidService } from '../bid/bid.service';
import { UploadService } from 'src/common/modules/upload/upload.service';
import { SysService } from 'src/backend/controller/sys/sys.service';
/**创建出价需求订单 */
const bailList = [
  {cname:"第一档次",labelvalue:10,checked:true},
  {cname:"第二档次",labelvalue:50,checked:false},
  {cname:"第三档次",labelvalue:100,checked:false},
  {cname:"第四档次",labelvalue:200,checked:false},
  {cname:"第五档次",labelvalue:500,checked:false},
  {cname:"第六档次",labelvalue:1000,checked:false},
  {cname:"第七档次",labelvalue:2000,checked:false},
  {cname:"第八档次",labelvalue:3000,checked:false},
]
@Controller('index')
export class IndexController {
  constructor(
    private readonly bidService: BidService,
    private readonly uploadService:UploadService,
    private readonly sysService:SysService
    ) {}  
  
  /* 轮播图 */
  //@UseGuards(AuthGuard('local'))
  @Get('/swiper')
  async getSwiper(){   
    let baseurl = "http://127.0.0.1:8000" ;
    let findConfig =await this.sysService.getConfig('sourceDomian')
    if(findConfig){
      baseurl = findConfig as string;
    }
    const getTurns = await this.uploadService.getTurnImgs();
    let imgArr = []
    if(getTurns.length>0){
      getTurns.map(res=>{
        imgArr.push({imgurl:baseurl+res.photo})
      })
    }    
    return imgArr;
  }
   
  /**获取客服数据 */
  @UseGuards(AuthGuard('jwt'))
  @Get('/kefu')
  async getKefuData() {
    let returnJson:any = await this.uploadService.frontGetKefu();
    let baseurl = await this.sysService.getConfig('sourceDomian')    
    let returnLists = []
    if(returnJson.length>0){
      returnJson.map(res=>{
        if(baseurl){
          res.photo = baseurl + res.photo
        }       
      })
    }
    //console.log(returnLists)
     return returnJson;
  }
  /* 购买支付的配置 */
  //@UseGuards(AuthGuard('local'))
  @Get('/configs')
  async getPayconfig(){
    return {"tags":[{"cname":"购买USDT","selected":true},{"cname":"出售USDT","selected":false}],
            "paytags":[{"cname":"微信支付","selected":true},{"cname":"支付宝支付","selected":false},{"cname":"paypal","selected":false}]
           };
  }
  @Post('/lists')
  async getLists(@Body() listinfo:any){   
    let searchData = {sta:1,indexShow:1}
    let limits = {
      limit:listinfo.pageSize,
      skip:listinfo.pageSize * (parseInt(listinfo.page) - 1)
    } 
    searchData.indexShow = 1
    if(listinfo.listType>0) (searchData as any).bidType = listinfo.listType    
    const selectItem = "bidTitle bidType bidUsdtMax bidUsdtMin userId username askBailNums bidPrice sellCount bidRmbMin bidRmbMax bidMethod realPrice totalUsdt";
    let listsdata= await this.bidService.getList(searchData,limits,selectItem,listinfo.userId)
    

    /**
     *  list:[{
     * merchantid:"dfadsf",
     *  issell:true,//是否是出售
     *  title:"123",
     *  isassure:true,//是否是保障交易图标
     *  pricelimitlow:"￥1000",
     *  pricelimithight:"￥90000",
     *  limitriseflag:false,
     *  limitrise:"-3.58%",
     * subtitle:"dadsfadsf",
     * avatar:"",
     * username:"",
     * isdeposit:true,
     * deposit:"1000USDT",
     * dealnum:"1000"
     * },
     * 
     * {
     * merchantid:"dfadsf",
     * issell:false,
     * title:"[支付宝]",
     * sellprice:"￥7.51",
     * sellrise:"8.21%",
     * pricelimitlow:"￥1000",
     * pricelimithight:"￥90000",
     *  subtitle:"dadsfadsf",
        avatar:"",
     * username:"",
     * isdeposit:true,
     * deposit:"1000USDT",
     * dealnum:"1000"
     * }
     * ]
     * 
     * 
     * 
     * 
     * 
     */
    let returnLists:any = listsdata as unknown
    returnLists.map(res=>{
      res.askNums = bailList[res.askBailNums].labelvalue
    })
    return returnLists;
  }

}
