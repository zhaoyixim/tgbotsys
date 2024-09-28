//import { NoAuth } from '@decorators/no.auth.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService) {}

   
    @Post('/sendCode')
    async sendEmailCode(@Body() data) {
        return this.emailService.sendEmailCode(data);
    }

    /**const emailTool = require('./Email');

//直接在service里调用此方法即可发送邮件了。
emailTool.sendEmail({ toEmail: "目标邮箱地址", "邮件的主题", "邮件的内容可以是text或者html" }); */
}