import { IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateBidDto {   
    @IsNotEmpty()
    public id: string;
    @IsNotEmpty()
    public readonly indexShow:number;
    @IsNotEmpty()
    public readonly sort: number; 
}
