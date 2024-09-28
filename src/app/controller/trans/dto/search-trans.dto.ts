import {  IsNotEmpty  } from 'class-validator';
export class SearchItemDto {
    @IsNotEmpty()
    public readonly userId: string;
    /**
     * 1-trc20
     * 2-erc20
     */
    @IsNotEmpty()
    public readonly netType: string;
     
}