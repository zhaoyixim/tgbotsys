import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';
import { Optional } from '@nestjs/common';

//export class UpdateMemberDto extends PickType(CreateMemberDto,['email']) {}
export class UpdateMemberDto extends OmitType(CreateMemberDto,['username']) {
  public readonly _id:any;
  public password:any;
  public readonly msgid:any;
  
}

export class UpdateMemberChangeDto{
  public readonly userId:any;
  public password:any;  
}