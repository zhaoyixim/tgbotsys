import {Body, Controller, Get, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';

  @Controller('v1/role')
  export class RoleController {
    constructor(private readonly roleService: RoleService) {}
   
    @UseGuards(AuthGuard('jwt'))
    @Get('list')
    async getConsole(@Body() request:any){
        return {"code":200,"result":{"page":1,"pageSize":10,"pageCount":60,
        "list":[{"id":55,"name":"孟桂英","explain":"谢涛","isDefault":true,"menu_keys":[],"create_date":"1987-07-19 06:54:39","status":"enable"},{"id":34,"name":"石丽","explain":"尹秀兰","isDefault":false,"menu_keys":["step-form","detail","workplace"],"create_date":"2001-07-19 07:02:11","status":"normal"},{"id":65,"name":"段洋","explain":"苏丽","isDefault":false,"menu_keys":["step-form","workplace","detail","console"],"create_date":"1981-01-16 11:08:27","status":"enable"},{"id":79,"name":"林芳","explain":"刘强","isDefault":false,"menu_keys":["workplace"],"create_date":"2016-12-10 05:20:03","status":"disable"},{"id":72,"name":"白丽","explain":"孟刚","isDefault":true,"menu_keys":[],"create_date":"1997-12-08 10:57:16","status":"enable"},{"id":14,"name":"锺静","explain":"段军","isDefault":false,"menu_keys":["basic-form","dashboard"],"create_date":"2002-08-10 09:01:15","status":"enable"},{"id":34,"name":"黎勇","explain":"刘强","isDefault":true,"menu_keys":["dashboard","basic-form"],"create_date":"1992-06-04 00:19:10","status":"disable"},{"id":50,"name":"张明","explain":"史涛","isDefault":true,"menu_keys":[],"create_date":"2016-07-02 10:38:05","status":"enable"},{"id":93,"name":"钱霞","explain":"韩超","isDefault":false,"menu_keys":["step-form","dashboard","basic-form"],"create_date":"1996-10-04 09:01:50","status":"normal"},{"id":89,"name":"杨秀兰","explain":"杨秀兰","isDefault":true,"menu_keys":["step-form","basic-form"],"create_date":"2010-11-13 11:50:13","status":"normal"}]},"message":"ok","type":"success"};
     }
  }