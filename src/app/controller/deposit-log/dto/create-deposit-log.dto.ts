import { IsEmail,  IsOptional,  MaxLength, MinLength } from 'class-validator';
let timedata = new Date();
let localctime = timedata.toLocaleString();
export class CreateDepositLogDto{
    public readonly userId:string;
    public readonly username:string;
    public readonly fromId:string;
    public readonly fromKey:string;
    public readonly fromValue:string;
    @IsOptional()
    public buymodel:number;
    
    @IsOptional()
    public fromDesp:string;

    @IsOptional()
    public touserId:string;
	@IsOptional()
	public fromValueTotal:number;
	
	
}