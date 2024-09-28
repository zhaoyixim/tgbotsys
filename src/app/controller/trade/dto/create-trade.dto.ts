import { IsEmail,  IsOptional,  MaxLength, MinLength } from 'class-validator';

export class CreateTradeDto {
    public readonly rmbCount:number;
    public readonly usdtCount:number;
    public readonly fromBidId:string;
    @IsOptional()
    public readonly buymodel:number;
}
export class CreateTradeOrderDto {
    public readonly userId:string;
    public readonly username:string;
    public readonly fromBidId:string;
    public readonly rmbNums:string;
    public readonly usdtNums:number;
    public staFlag:number;
}
export class CreateCollectDto{
    public readonly userId:string;
    public readonly username:string;
    public readonly fromBidId:string;
}
