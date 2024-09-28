import { Inject, Injectable } from '@nestjs/common';
import { ENV_PATH } from '../../backend/common/constants/token.const';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigurationService {
  private config :any;
  constructor(
    @Inject(ENV_PATH) private readonly path:string
  ){
    this.setEnvironment();
  }
  private setEnvironment():void{
    const filePath = path.resolve(__dirname,'../../',this.path);
    this.config = dotenv.parse(fs.readFileSync(filePath));
  }
  public get(Key:string):string{
    return this.config[Key];
  }

}
