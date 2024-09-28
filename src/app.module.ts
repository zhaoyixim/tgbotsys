
import { Module, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import MongoConfigFactory  from './config/mongo.config';
import SecretConfigFactory from './config/secret.config';
import { ResponseInterceptor } from './common/interceptors/ResponseInterceptor';
import { BackendModule } from './backend/backend.module';
import {  join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FrontModule } from './app/front.module';
@Module({
    imports: [
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'public/static'),
        serveRoot: '/static',
      }), 
      /*      
      AuthorizationModule.register({
        modelPath: join(__dirname, './common/rbac/model.conf'),
        policyAdapter: join(__dirname, './common/rbac/policy.csv'),
        global: true,
      }),
      */
      ConfigModule.forRoot({
       // envFilePath: 'development.env',
        load: [MongoConfigFactory,SecretConfigFactory],
        isGlobal: true
      }),
      MongooseModule.forRootAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory:async (config: ConfigService)=>({
          uri:config.get<string>('mongo.uri'),
          //useFindAndModify: false,
          dbName:config.get<string>('mongo.dbname')})
      }),    
      FrontModule,
      BackendModule,
    ],
  controllers: [AppController],
  providers: [AppService,
    {//注入全域Pipe
      provide:APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide:APP_INTERCEPTOR,
      useClass:ResponseInterceptor
    }
  ],
})
export class AppModule {}
