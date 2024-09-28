import { IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateConfigDto {

  @IsNotEmpty()
  public readonly cname: string;

  @IsNotEmpty()
  public readonly ckey: string;

  @IsNotEmpty()
  public readonly cvalue: string;
  
  @IsNotEmpty()
  public readonly cenable: string; 

}