import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollectDocument = Collect & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Collect {
  @Prop({required: true})
  userId: String;
  @Prop({required: true})
  username: String;
  /**fromBidId */
  @Prop({required: true})
  fromBidId: String; 
  /**创建时间 */
  @Prop({required:false,default:localctime})
  ctime:string; 
}
export const CollectSchema = SchemaFactory.createForClass(Collect);
export const Collect_MODEL_TOKEN = Collect.name;
export const CollectDefinition: ModelDefinition = {
  name: Collect_MODEL_TOKEN,
  schema: CollectSchema,
};