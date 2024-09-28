import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { AllExceptionsFilter } from './common/filters/any-exception.filter';
//import { HttpExceptionFilter } from './common/filters/http-exception.filter';
//import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as compression from 'compression';

//import { Logger } from './utils/log4js.util';
//import { logger } from './common/filters/http-rq.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
//import { VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
//import { join } from 'path';
import * as bodyParser from 'body-parser';

//import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  app.enableCors();
  /*
  app.enableVersioning({
    defaultVersion: VERSION_NEUTRAL,
    type: VersioningType.MEDIA_TYPE,
    key: 'v='
  });*/
  //日志相关
  //app.use(logger); // 所有请求都打印日志  logger ？
  //app.useGlobalInterceptors(new TransformInterceptor()); // 使用全局拦截器 收集日志
  app.use(compression());//使用压缩中间件包启用 gzip 压缩。
  // 错误异常捕获 和 过滤处理
 // app.useGlobalFilters(new AllExceptionsFilter());
  //app.useGlobalFilters(new HttpExceptionFilter()); // 全局统一异常返回体
  //app.setViewEngine('hbs');
  app.setGlobalPrefix('api');
  //app.useWebSocketAdapter(new WsAdapter(app)); // 使用websocket
  app.use(bodyParser.json({limit: '500mb'}));
  await app.listen(8000);
}
bootstrap();
