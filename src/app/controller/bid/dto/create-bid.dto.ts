import { IsEmail,  IsOptional,  MaxLength, MinLength } from 'class-validator';
let timedata = new Date();
let localctime = timedata.toLocaleString();
export class CreateBidDto {
    public  userId: string;
    public  username: string;
    public readonly bidType: number;
    public readonly bidPriceType: number;
    public readonly bidPrice: number;
    public readonly realPrice: string;
    public readonly bidMethod: string;
    public readonly bidMethodNum: number;
    public readonly bidRmbMax: number;
    public readonly bidRmbMin: number;
    public readonly validPeriod: number;
    public readonly bidTimes: number;
    public readonly orderStartDate: string;
    public readonly orderStartTime: string;
    public readonly orderEndDate: string;
    public readonly orderEndTime: string;
    public readonly bidTitle: string;
    public readonly bidDesp: string;
    @IsOptional()
    public imageFiles:string;
	@IsOptional()
	public sellCount:number;
	@IsOptional()
	public freezeTotal:number;	
}
export class bidOrderIndexDto {
    @IsOptional()
    public  sta:number = 1; 
    @IsOptional()
    public  indexShow:boolean = true;
}
