import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Socket } from 'dgram';
import { Document } from 'mongoose';

export type VchatDocument = Vchat & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Vchat {
  @Prop({
    required: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  clientId: string;

  @Prop({
    required: false,
    default:1
  })
  online: number;

  /**创建时间 */
  @Prop({
    required:false,
    type:String,
    default:localctime
  })
  ctime:string; 
}
export const VchatSchema = SchemaFactory.createForClass(Vchat);
export const Vchat_MODEL_TOKEN = Vchat.name;
export const VchatDefinition: ModelDefinition = {
  name: Vchat_MODEL_TOKEN,
  schema: VchatSchema,
};