import { IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateConfigDto {

  @IsNotEmpty()
  public readonly id: string;

  @IsNotEmpty()
  public readonly cenable: string; 

}