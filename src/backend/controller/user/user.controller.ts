import { Body,ConflictException,Controller,Delete,ForbiddenException,Get,Param,Patch,Post,Query,UseGuards} from '@nestjs/common';
import { SearchPipe } from 'src/backend/common/pipes';
import { SearchDto } from './dto/search.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RealIP } from 'nestjs-real-ip';

//@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Query(SearchPipe) query: SearchDto) {
    return this.userService.findUsers(query, '-password');
  }

  @Get('testuser')
  async makeTestUser() {
    let dto = {
      username:"admin",
      password:"123456"
    }
    let username = dto.username

    const users = await this.userService.findUser({username:dto.username});   
    
    const exist = await this.userService.existUser({
      $or: [{ username }],
    });
    if (exist) {
      this.userService.deleteUser(users._id)
     // throw new ConflictException('username or email is already exist.');
    }

    const user = await this.userService.createUser(dto);

    const { password, ...result } = user;
    return user;
  }



  @Post('login')
  async getLogin(@Body() dto:CreateUserDto){
    const user = await this.userService.findUser({username:dto.username});
    if (!user) {
      throw new ConflictException('账号错误');
    }   
    const { _id: id, username, role } = user;
    //{"code":200,"result":{"token":"DYPEUVGCERUYUYFONNUTCFBSQMWISKWX"},"message":"ok","type":"success"}
    return {
      "result": this.userService.generateJwt({ id, username, role }),
      "message":"ok",
      "type":"success"
    }
  }



  //{"code":200,"result":{"userId":"1","username":"admin","realName":"Admin","avatar":"http://dummyimage.com/240x400","desc":"manager","password":"NHJYCLC","token":"FCEGHBJVDWBICOCQEZYXJOILWEQSSIRU","permissions":[{"label":"主控台","value":"dashboard_console"},{"label":"监控页","value":"dashboard_monitor"},{"label":"工作台","value":"dashboard_workplace"},{"label":"基础列表","value":"basic_list"},{"label":"基础列表删除","value":"basic_list_delete"}]},"message":"ok","type":"success"}
  
  @UseGuards(AuthGuard('jwt'))
  @Get('admininfo')
  async adminIndex(@Body() userinfo:any){
    return {
    "result":{
      "userId":"1","username":"admin","realName":"Admin","avatar":"http://dummyimage.com/240x400",
      "desc":"manager","password":"NHJYCLC","token":"FCEGHBJVDWBICOCQEZYXJOILWEQSSIRU",
      "permissions":[
        {"label":"主控台","value":"dashboard_console"},
        {"label":"监控页","value":"dashboard_monitor"},
        {"label":"工作台","value":"dashboard_workplace"},
        {"label":"基础列表","value":"basic_list"},
        {"label":"基础列表删除","value":"basic_list_delete"}
      ]
  }};
  }

/**
 * 后台用户列表
 * @param dto 
 * @returns 
 */
 @UseGuards(AuthGuard('jwt'))
 @Post('list')
 async getuserlist(@Body() listinfo:any){
    let pageinfo = {
      limit:listinfo.pageSize,
      skip:listinfo.pageSize * (parseInt(listinfo.page) - 1)
    }  
   let userinfo = await this.userService.findMembers(pageinfo);
   let returninfo = {
    "list":userinfo.data,
    "page":listinfo.page,
    "pageSize":listinfo.pageSize,
    "pageCount":userinfo.count
   }
   //分页
   return {
    "code":200,
    "result":returninfo,
    "message":"ok",
    "type":"success"
   }
 }


 /**编辑指定KEY Item */

@Post('editUinqueKey')
async editUinqueKey(@Body() editInfo:any){
  let {userId,ckey,cvalue} = editInfo
   return await this.userService.editMember({userId,ckey,cvalue})
}
 /**
  * 设定加入黑名单
  * @param dto 
  * @returns 
  */
  @UseGuards(AuthGuard('jwt'))
  @Post('setblackname')
  async setBlackList(@Body() setinfo:any,@RealIP() ip: string){
    setinfo.ip = ip;
    return {
      "code":200,
      "result":this.userService.setBlackList(setinfo),
      "message":"ok",
      "type":"success"
     }
  }

  //后续不开放
  @Post('reg')
  async createUser(@Body() dto: CreateUserDto) {
    let username = dto.username
    const exist = await this.userService.existUser({
      $or: [{ username }],
    });
    if (exist) {
      throw new ConflictException('username or email is already exist.');
    }

    const user = await this.userService.createUser(dto);
    const { password, ...result } = user;
    return result;
  }

}