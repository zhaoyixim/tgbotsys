import { UploadService } from './upload.service';
import { Controller, Get, Render, Post,UseInterceptors,UploadedFile, Body, UploadedFiles, Req} from '@nestjs/common';
import { FileInterceptor,FilesInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Request } from 'express';
@Controller('v1/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('sigleUpload')
  @UseInterceptors(FileInterceptor('file'))
  addUser(@UploadedFile() file,@Body() body){
          console.log(body); 
          console.log(file);     
          const writeImage = createWriteStream(join(__dirname, '..','../public/static', `${file.originalname}`))
          writeImage.write(file.buffer)
          return '上传成功';
  }

  @Post('multiUpload')
  @UseInterceptors(FilesInterceptor('files'))
  async addAllUser(@UploadedFiles() files,@Body() body){     
    let file =files[0]     
    let savename = Date.now()+decodeURIComponent(escape(file.originalname))      
    const writeImage = createWriteStream(join(__dirname, '../../../../', '../dist/public/static', `${savename}`));
    writeImage.write(file.buffer);
    writeImage.end();
  

  // for (const file of files) {
  //     let savename =  decodeURIComponent(escape(file.originalname))      
  //     const writeImage = createWriteStream(join(__dirname, '../../../../', '../public/images', `${Date.now()}-${savename}`));
  //     writeImage.write(file.buffer);
  // }
     
    let imgdata = "/static/"+savename
    const saveData = {
      photo:imgdata,
      sts:1,
      ctype:1
    }
    const returnjson = await this.uploadService.createUpload(saveData)
    return {data:returnjson};
  }

  @Post('multiUploadcttype2')
  @UseInterceptors(FilesInterceptor('files'))
  async addmultiUploadcttype(@UploadedFiles() files,@Body() body){     
    let file =files[0]     
    let savename = Date.now()+decodeURIComponent(escape(file.originalname))      
    const writeImage = createWriteStream(join(__dirname, '../../../../', '../dist/public/static', `${savename}`));
    writeImage.write(file.buffer);
    writeImage.end();
    let imgdata = "/static/"+savename
    const saveData = {
      photo:imgdata,
      sts:1,
      ctype:2
    }
    const returnjson = await this.uploadService.createUpload(saveData)
    return {data:returnjson};
  }


  @Post('deleteImg')
  async deleteImages(@Req() request:Request){
      const {body} = request
      const {imgId } = body
      return await this.uploadService.deleteUpload(imgId)
  }

  @Post('getImages')
  async getImages(@Req() request:Request){
    let {ctype,ctype2} = request.body
    if(ctype2==undefined) ctype2 = 0    
    return await this.uploadService.getStsImages(ctype,ctype2)
  }

  @Post('multiUploadcttype3')
  @UseInterceptors(FilesInterceptor('files'))
  async multiUploadcttype3(@UploadedFiles() files,@Body() body){     
    let file =files[0]     
    let savename = Date.now()+decodeURIComponent(escape(file.originalname))      
    const writeImage = createWriteStream(join(__dirname, '../../../../', '../dist/public/static', `${savename}`));
    writeImage.write(file.buffer);
    writeImage.end();
    let imgdata = "/static/"+savename
    const saveData = {
      photo:imgdata,
      sts:1,
      ctype:3,
      ctype2:body.ctype2,
      ctype2Lable:body.ctype2Lable
    }
    const returnjson = await this.uploadService.createUpload(saveData)
    return {data:returnjson};
  }
  @Post('upKefuData')
  async upKefuData(@Body() body){
    const returnjson = await this.uploadService.updateKefu(body)
    return returnjson;
  }

}

