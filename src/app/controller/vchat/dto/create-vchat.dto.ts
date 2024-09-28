
import {  IsNotEmpty,IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Optional } from '@nestjs/common';

export class CreateVchatDto {
    @IsNotEmpty()
    public readonly username: string;
    @IsNotEmpty()
    public readonly userId: string;
    @IsNotEmpty()
    public  clientId: string;
}


export class CreateVmessageDto {
    @IsNotEmpty()
    public readonly username: string;
    @IsNotEmpty()
    public readonly userId: string;
    @IsNotEmpty()
    public readonly touserId: string;
 
    public fromBidId:string;
    public fromTradeId:string;
    public ctype:number;
    @Optional()
    public contentBody:string;
    @IsNotEmpty()
    public  content: string;
    
}

