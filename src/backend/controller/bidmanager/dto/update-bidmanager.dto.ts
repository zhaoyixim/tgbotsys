import { IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
export class UpdateBidmanagerDto {
  @IsNotEmpty()
  public readonly id: string;
  @IsNotEmpty()
  public readonly indexShow:number;
  @IsNotEmpty()
  public readonly sort: number; 
}
