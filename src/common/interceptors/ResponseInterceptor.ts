// 全局 拦截器 用来收集日志
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {map, Observable } from 'rxjs';
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> { 
    const handler = next.handle();
    return handler.pipe(
      map((data)=>{
        const response = context.switchToHttp().getResponse();
        if(response.statusCode == 201) response.statusCode = 200
        let result = data.result? data.result:data;
        return {
          code: response.statusCode || 200,
          result :result?result:"",
          message :data.message? data.message :"ok",
          type :data.type?data.type:"success"
        }
      })
    )    
  }
}