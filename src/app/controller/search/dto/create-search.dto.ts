import { IsOptional, IsNotEmpty, } from 'class-validator';


export class CreateSearchDto {
  @IsNotEmpty()
  public readonly username: string;
  @IsNotEmpty()
  public readonly password: string;

}

export class SearchDto {
  [x: string]: any;
  @IsOptional()
  skip?: number;

  @IsOptional()
  limit?: number;
  @IsOptional()
  buymodel?:number;
}