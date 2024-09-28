import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';


export class CreateUploadDto {
  @IsNotEmpty()
  public readonly photo: string; 
  /**
  * 状态:
  * 0--删除
  * 1--正常
  *  
  */

  @IsOptional()
  public readonly sts: number;

    /**类型
   * 1--轮播图
   * 2--收款码
   */
  @IsOptional()
  public readonly ctype: number;

}