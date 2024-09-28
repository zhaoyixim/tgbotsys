import {  IsNotEmpty,IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

/**
 * 写入日志
 */
export class CreateFundsDto {
  @IsNotEmpty()
  public readonly userId: string;
  @IsNotEmpty()
  public readonly username: string;
  @IsNotEmpty()
  public readonly netType: string;
  @IsNotEmpty()
  public readonly netTypeLabel: string;
  @IsNotEmpty()
  public readonly nums: number;
  
}

/**写入资产表 */
export class CreateDepositDto extends PartialType(CreateFundsDto) {
  @IsNotEmpty()
  public readonly freezeNums: string;
  @IsNotEmpty()
  public readonly restAllNums: string;
  @IsNotEmpty()
  public readonly userId: string;
  @IsNotEmpty()
  public readonly netType: string;
}
/**写入订单表 */
export class CreateOrderDto extends PartialType(CreateFundsDto) {
  @IsNotEmpty()
  public readonly orderTitle: string;
  @IsNotEmpty()
  public readonly orderSts: number;
  @IsOptional()
  public  ctime: String | Date;
  @IsOptional()
  public  expireTime: string;

}