import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MsgDocument = Msg & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Msg {
  @Prop({
    required: true,
  })
  userId: String;

  @Prop({
    required: true,
  })
  msgcode: string;


  /**是否已经使用 */
  @Prop({
    required:false
  })
  used: string = "0";

  @Prop({
    required:false
  })
  ctime:string = localctime;
  
  @Prop({
    required:false
  })
  uptime:string;

}
export const MsgSchema = SchemaFactory.createForClass(Msg);
export const MSG_MODEL_TOKEN = Msg.name;
export const MSGDefinition: ModelDefinition = {
  name: MSG_MODEL_TOKEN,
  schema: MsgSchema,
};