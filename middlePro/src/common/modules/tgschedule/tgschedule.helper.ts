import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios-https-proxy-fix';

import { Telegraf } from 'telegraf';
import { Cron } from '@nestjs/schedule';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { InputMediaPhoto } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class TgscheduleHelper{
    private proxyConfig = {
        proxy: {
          protocol: 'http',
            host: '127.0.0.1',
            port: 7890
        }
      }
    private bot : Telegraf;

    constructor(){
        const { protocol, host, port } = this.proxyConfig.proxy;
        const proxy = `${protocol}://${host}:${port}`; // 组合成代理字符串
        const agent = new HttpsProxyAgent(proxy); // 创建代理实例
      
        this.bot=new Telegraf("7639219320:AAGG-XEi8bdQl17fIMDDl6AcpVPO6yEtbzs",{
          telegram: { agent }, // 使用代理
        });//bot token

        let userId = null; // 初始化为 null

        this.bot.start((ctx) => {
          ctx.reply('欢迎使用机器人！');   
      });

      

           
        // this.bot.on('channel_post', (ctx) => {
        //   console.log('接收到频道消息:', ctx.channelPost); // 打印整个消息对象
        //   const message = ctx.channelPost;
        //   if (message && 'text' in message) {
        //     const messageText = message.text;
        //     console.log(`频道消息: ${messageText}`);
        //   }
        // });

        let messageText =  {
            message_id: 151,
            sender_chat: {
              id: -1002236185577,
              title: '北京',
              username: 'beijing1478',
              type: 'channel'
            },
            chat: {
              id: -1002236185577,
              title: '北京',
              username: 'beijing1478',
              type: 'channel'
            },
            date: 1727532132,
            media_group_id: '13820257058219493',
            photo: [
              {
                file_id: 'AgACAgUAAyEFAASFSXvpAAOXZvgMZPXWxIma4Be2FNYncs8Sv0kAAmnDMRtoMMBXEEXPXWAIHUkBAAMCAANzAAM2BA',
                file_unique_id: 'AQADacMxG2gwwFd4',
                file_size: 1126,
                width: 60,
                height: 90
              },
              {
                file_id: 'AgACAgUAAyEFAASFSXvpAAOXZvgMZPXWxIma4Be2FNYncs8Sv0kAAmnDMRtoMMBXEEXPXWAIHUkBAAMCAANtAAM2BA',
                file_unique_id: 'AQADacMxG2gwwFdy',
                file_size: 14100,
                width: 214,
                height: 320
              },
              {
                file_id: 'AgACAgUAAyEFAASFSXvpAAOXZvgMZPXWxIma4Be2FNYncs8Sv0kAAmnDMRtoMMBXEEXPXWAIHUkBAAMCAAN4AAM2BA',
                file_unique_id: 'AQADacMxG2gwwFd9',
                file_size: 67493,
                width: 535,
                height: 800
              },
              {
                file_id: 'AgACAgUAAyEFAASFSXvpAAOXZvgMZPXWxIma4Be2FNYncs8Sv0kAAmnDMRtoMMBXEEXPXWAIHUkBAAMCAAN5AAM2BA',
                file_unique_id: 'AQADacMxG2gwwFd-',
                file_size: 129980,
                width: 856,
                height: 1280
              }
            ],
            caption: '北京甜筒\n#硬5w↑桐桐\n中戏在校生纯兼职 175 96斤 A4腰筷子腿 本人零整容长相清纯气质佳 无纹身 只见素质课🫶🏻\n#北京市朝阳区',
            caption_entities: [
              { offset: 5, length: 4, type: 'hashtag' },
              { offset: 64, length: 7, type: 'hashtag' }
            ]
          };

        const photoId = messageText.photo[0].file_id;

        const photos: InputMediaPhoto[] = messageText.photo.slice(0, 2).map((photo) => ({
            type: 'photo',
            media: photo.file_id,
            caption: messageText.caption, // 使用相同的 caption
        }));
        
        const caption = messageText.caption || '没有内容';
    
        this.bot.on('text', (ctx) => {
          console.log('接收到的消息:', ctx.message.text);
          userId = ctx.chat.id; // 保存用户 ID
          console.log('用户 ID:', userId); // 打印用户 ID

          // 发送图片到另一个聊天（请替换为目标 chat_id）
              const targetChatId =userId;

              this.bot.telegram.sendMediaGroup(targetChatId, photos)
              .then(() => {
                  console.log('图片发送成功');
              })
              .catch((error) => {
                  console.error('发送时出错:', error);
              });

          
      });

        
        //this.bot.on('text', (ctx) =>  ctx.replyWithPhoto(photoId, { caption }));
    

        this.bot.launch().then(() => {
            console.log('机器人已启动');
        }).catch(err => {
            console.error('启动失败:', err);
        });

        
    }

   
  // @Cron('* * * * * *') 
  // handleCron() {
  //   console.log('每秒执行一次的任务');
    
  // }
    
}
  